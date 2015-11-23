import {Component} from 'react';
import getStoreShape from './getStoreShape.js'

export default (WrappedContainer, store) => {
    return class EnhanceWihtStore extends Component {

        state = {}

        constructor(props, context) {
            super(props, context)

            this.__oldState = '@@stateUnInit';

            this.state.props = store.getState();

            this.unsubscribe = store.subscribe(()=> {
                if (this.state.props == store.getState()) {
                    return;
                }
                this.__oldState = this.state.props;
                this.setState({
                    props: store.getState()
                })
            })
        }

        componentWillUnmount() {
            this.unsubscribe();
        }

        //babel新版,class里有static会导致一写奇怪的问题...
        static childContextTypes={
            store:getStoreShape
        }

        getChildContext() {
            return {store: this.store};
        }

        //getWrappedInstance() {
        //    return this.refs.wrappedInstance;
        //}

        render() {
            return (
                <WrappedContainer {...this.props} store={store} __oldState={this.__oldState}/>
            )
        }
    }
}
