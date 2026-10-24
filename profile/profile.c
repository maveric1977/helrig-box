/*
 * The Helrig Box profile: what makes a ToneRelay build a Helrig Box. It is compiled into ToneRelay's firmware by scripts/build.sh
 * (TONERELAY_PROFILE_DIR points here); see ToneRelay's esp32-p4/components/tonerelay/profiles/README.md for the mechanism.
 *
 * The names follow Helrig's brand guide: the hardware is "Helrig Box", two words. A Wi-Fi network name may contain a space; a host
 * name and a service type cannot, so those read helrigbox / _helrigbox.
 */
#include "tonerelay.h"

/* setup.html, embedded by the build (EMBED_TXTFILES adds a terminating zero). */
extern const char setup_html_start[] asm("_binary_setup_html_start");
extern const char setup_html_end[] asm("_binary_setup_html_end");

static const char *setup_page(size_t *len)
{
    size_t n = (size_t)(setup_html_end - setup_html_start);
    if (n > 0 && setup_html_start[n - 1] == 0) {
        n--;
    }
    *len = n;
    return setup_html_start;
}

const tonerelay_profile_t TONERELAY_PROFILE = {
    .name = "helrig",
    .hostname = "helrigbox",           /* helrigbox.local */
    .instance = "Helrig Box",          /* "Helrig Box e7fb0b" once the box id is added */
    .service = "_helrigbox",           /* next to the contract's _tonerelay._tcp */
    .ap_prefix = "Helrig Box",         /* the setup network, "Helrig Box e7fb0b" */
    .with_id = true,
    .setup_ap_only = true,             /* the setup network goes off once the box has joined one */
    .relay_only_default = true,        /* a Helrig Box is a relay: the pedal belongs to the app */
    .setup_page = setup_page,
};
