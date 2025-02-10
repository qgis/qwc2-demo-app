
window.addEventListener("QWC2ApiReady", () => {

    const {React, PropTypes, connect} = window.qwc2.libs;
    const {TaskBar} = window.qwc2.components;

    class HelloWorld extends React.Component {
        static propTypes = {
            active: PropTypes.bool
        };
        render() {
            if (!this.props.active) {
                return null;
            }
            return React.createElement(TaskBar, {onHide: this.quit, task: "HelloWorld"},
                React.createElement('span', {role: 'body'}, "Hello world")
            );
        }
        quit = () => {
            window.qwc2.setCurrentTask(null);
        };
    }

    const HelloWorldPlugin = connect(state => ({
        active: state.task.id === "HelloWorld"
    }))(HelloWorld);

    window.qwc2.addPlugin("HelloWorldPlugin", HelloWorldPlugin);
});

