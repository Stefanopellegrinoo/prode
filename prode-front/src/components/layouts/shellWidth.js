// Shell max-width per AppLayout `width` prop. Extracted to its own module (not
// exported alongside the AppLayout component) so fixed-position widgets that live
// outside the shell's normal flow (e.g. Predictions' SaveBar) can reuse the exact
// literal values without duplicating them or triggering react-refresh/only-export-components.
export const SHELL_WIDTH = {
  default: "max-w-[430px] md:max-w-[720px]",
  wide: "max-w-[430px] md:max-w-[880px]",
};
