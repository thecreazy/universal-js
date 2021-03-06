import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { StaticRouter } from 'react-router'
import { renderToString } from 'react-dom/server'

import AppContainer from '../universal/routes'

export default class Html extends Component {

    static propTypes = {
        url: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        assets: PropTypes.object
    }

    render () {

        const PROD = process.env.NODE_ENV === 'production'

        const {
            title,
            assets,
            store,
            url,
            context
        } = this.props

        const {
            manifest,
            app,
            vendor
        } = assets || {}

        const initialState = `window.__INITIAL_STATE__ = ${JSON.stringify(store)}`
        // const Layout = PROD ? require( '../../build/prerender.js') : () => {}

        const root = renderToString(
            <StaticRouter location={url} context={context}>
                <AppContainer />
            </StaticRouter>
        )

        return (
            <html>
                <head>
                <meta charSet="utf-8"/>
                <title>{title}</title>
                { PROD && <link rel="stylesheet" href="/static/prerender.css" type="text/css" /> }
                </head>
                <body>
                <script dangerouslySetInnerHTML={{ __html: initialState }} />
                <div id="root" dangerouslySetInnerHTML={{ __html: root }}></div>
                { null && PROD && <script dangerouslySetInnerHTML={{ __html: manifest.text }}/> }
                { PROD && <script src={ vendor.js }/> }
                <script src={ PROD ? app.js : '/static/app.js' } />
                </body>
            </html>
        )
    }

}