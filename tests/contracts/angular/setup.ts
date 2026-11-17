// Builder setup: the Angular TestBed is initialised by the builder (zoneless). Styles come from the build target.
// The contracts (including axe colour contrast) are written for the light theme. The stylesheet switches to dark tokens
// under prefers-color-scheme unless data-theme="light" is set, so pin the light theme for this runner.
document.documentElement.setAttribute("data-theme", "light")
