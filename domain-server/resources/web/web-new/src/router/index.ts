//  index.ts
//
//  Created by Kalila L. on Sep. 4th, 2021.
//  Copyright 2021 Vircadia contributors.
//  Copyright 2021 DigiSomni LLC.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html

import { route } from "quasar/wrappers";
import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
    RouteLocation,
    NavigationGuardNext
} from "vue-router";
import routes from "./routes";
import { Settings } from "@Modules/domain/settings";
import { SettingsValues } from "@Modules/domain/interfaces/settings";

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : (process.env.VUE_ROUTER_MODE === "history" ? createWebHistory : createWebHashHistory);

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(
            process.env.MODE === "ssr" ? void 0 : process.env.VUE_ROUTER_BASE
        )
    });

    Router.beforeEach((to: RouteLocation, from: RouteLocation, next: NavigationGuardNext) => {
        Settings.getValues()
            .then((values: SettingsValues) => {
                if (to.path === "/wizard" && values.wizard?.completed_once) {
                    next({ path: "/" });
                } else if (to.path !== "/wizard" && !(values.wizard?.completed_once)) {
                    next({ path: "/wizard" });
                } else {
                    next();
                }
            });
    });

    return Router;
});
