// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import { History } from "history";
import React, { useEffect } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { IntlProvider } from "react-intl";

import TelemetryClient from "./telemetry/telemetryClient";

import { FlashMessages } from "./components/flashMessages";
import { getMessages } from "./i18n";
import FocalboardRouter from "./router";
import { fetchClientConfig } from "./store/clientConfig";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { fetchLanguage, getLanguage } from "./store/language";
import { fetchMe, getMe } from "./store/users";
import { Utils } from "./utils";

import { IUser } from "./user";

type Props = {
    history?: History<unknown>;
};

const App = (props: Props): JSX.Element => {
    const language = useAppSelector<string>(getLanguage);
    const me = useAppSelector<IUser | null>(getMe);
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchLanguage());
        dispatch(fetchMe());
        dispatch(fetchClientConfig());
    }, []);

    useEffect(() => {
        if (me) {
            TelemetryClient.setUser(me);
        }
    }, [me]);

    return (
        <IntlProvider
            locale={language.split(/[_]/)[0]}
            messages={getMessages(language)}
        >
            <DndProvider
                backend={Utils.isMobile() ? TouchBackend : HTML5Backend}
            >
                <FlashMessages milliseconds={2000} />
                <div id="frame">
                    <div id="main">
                        <FocalboardRouter history={props.history} />
                    </div>
                </div>
            </DndProvider>
        </IntlProvider>
    );
};

export default React.memo(App);
