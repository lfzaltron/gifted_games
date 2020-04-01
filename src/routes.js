import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import SevenLine from './pages/SevenLine';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={SevenLine} />
            </Switch>
        </BrowserRouter>
    );
}
