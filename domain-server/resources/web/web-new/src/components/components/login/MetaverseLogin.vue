<!--
//  MetaverseLogin.vue
//
//  Created by Kalila L. on May 18th, 2021.
//  Copyright 2021 Vircadia contributors.
//  Copyright 2021 DigiSomni LLC.
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
-->

<template>
    <q-form
        @submit="onSubmit"
        @reset="onReset"
        class="q-gutter-md"
        :autocomplete="AUTOCOMPLETE"
    >
        <q-input
            v-model="username"
            filled
            dark
            label="Username"
            hint="Enter your username."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter a username.']"
        />

        <q-input
            v-model="password"
            filled
            dark
            label="Password"
            :type="showPassword ? 'text' : 'password'"
            hint="Enter your password."
            lazy-rules
            :rules="[ val => val && val.length > 0 || 'Please enter a password.']"
        >
            <template v-slot:append>
                <q-icon
                    :name="showPassword ? 'visibility' : 'visibility_off'"
                    class="cursor-pointer"
                    @click="showPassword = !showPassword"
                />
            </template>
        </q-input>

        <div align="right">
            <q-btn label="Reset" type="reset" color="primary" flat class="q-mr-sm" />
            <q-btn label="Login" type="submit" color="primary"/>
        </div>
    </q-form>
</template>

<script>
import { Metaverse } from "src/modules/domain/metaverse";

export default {
    name: "MetaverseLogin",

    emits: ["loginResult"],

    data: () => ({
        username: "",
        password: "",
        showPassword: false,
        // TODO: Needs to be stored somewhere central.
        DEFAULT_METAVERSE_URL: "https://metaverse.vircadia.com/live",
        AUTOCOMPLETE: false
    }),

    methods: {
        async onSubmit () {
            const metaverseUrl = await Metaverse.retrieveMetaverseUrl();
            const result = await Metaverse.attemptLogin(metaverseUrl, this.username, this.password);

            this.$emit("loginResult", { "success": result.success, "metaverse": metaverseUrl, "data": result.response });
        },

        // TODO: This needs to be addressed in a more modular fashion to reuse and save state across multiple components.

        onReset () {
            this.username = "";
            this.password = "";
        }
    }
};
</script>
