import React, { ReactElement } from "react";

import NotFound from "pages/pages/notfound/index";
import { Page } from "types/types";

const Custom404: Page = () => <NotFound />;

Custom404.getLayout = function getLayout(page: ReactElement) {
  return page;
};

export default Custom404;
