import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';


class Homepage extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            numButtonClicks: 0,
            showModal: false
        }

        // Gives method permission to use this.setState to change the state
        this.buttonClickFunction = this.buttonClickFunction.bind(this);
        this.modalButtonClickFunction = this.modalButtonClickFunction.bind(this);
    };


    buttonClickFunction() {
        // this.state.numButtonClicks += 1
        // this.setState is an ASYNC operation
        // it can allow the control to skip over before the state is updated
        this.setState({ 
            numButtonClicks: this.state.numButtonClicks + 1,
            showModal: true
         },
            () => { console.log(this.state.numButtonClicks) }
        );
    }

    modalButtonClickFunction() {
        this.setState({ 
            showModal: false 
        }, 
            () => { console.log("Clicked button in modal.") }
        );
    }

    render() {
        // some javascript code

        // HTML - looking, with embedded javascript
        return (
        <div>
            <h1>Homepage</h1>

            {/* All javascript in render's return statement has to be in {}, even comments! */}
            <Button
                onClick={this.buttonClickFunction}
            >
            Text in button
            </Button>

            <Modal
                show={this.state.showModal}
                    onHide={() => { this.setState({ showModal: false }) }}
            >
                    <Modal.Header closeButton>
                        <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.modalButtonClickFunction}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
            </Modal>
        </div>
        );
    }

}

export default Homepage;
