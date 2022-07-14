import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CloseButton from 'react-bootstrap/CloseButton';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

import FuzzySearch from 'react-fuzzy';

class Homepage extends React.Component {

    constructor(props) {
        super(props)

        // Code for initial date selection fields
        // set default start time at 9:30am on the last weekday
        let bumpedDate = new Date();
        bumpedDate.setDate(bumpedDate.getDate() - 1);

        // make sure the day is a weekday
        while ((bumpedDate.getDay() > 5) || (bumpedDate.getDay() === 0)) {
            bumpedDate.setDate(bumpedDate.getDate() - 1);
        }

        // set the time to 9:30am Eastern
        let defaultStartTime = new Date(Date.UTC(
            bumpedDate.getFullYear(),
            bumpedDate.getMonth(),
            bumpedDate.getDate(),
            13 + this.isStandardTime(bumpedDate.getTime()),
            30
        ));

        // set the default end time a few minutes later
        let defaultEndTime = new Date(defaultStartTime);

        const defaultSimulationMinutes = 10;
        const oneMinInMs = 60000;
        const defaultTimeDiff = defaultSimulationMinutes * oneMinInMs;
        defaultEndTime.setTime(defaultEndTime.getTime() + defaultTimeDiff);

        // 6hrs, 30min converted to milliseconds
        const marketHoursDuration = ((6 * 60) + 30) * oneMinInMs;

        let minStartTime = new Date(defaultStartTime);
        minStartTime.setDate(minStartTime.getDate() - 360);

        let maxStartTime = new Date(defaultStartTime);
        maxStartTime.setTime(maxStartTime.getTime() + marketHoursDuration - oneMinInMs);

        let minEndTime = new Date(minStartTime);
        minEndTime.setTime(minEndTime.getTime() + oneMinInMs);

        let maxEndTime = new Date(maxStartTime);
        maxEndTime.setTime(maxEndTime.getTime() + oneMinInMs);

        // simulation defaults
        const defaultInitialCash = 10000;
        const defaultTransactionCost = 0;
        const defaultDelay = 0;


        this.state = {
            numButtonClicks: 0,
            showModal: false,
            tickersAndNames: [],
            // simulation parameters
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            securitySet: [],
            initialCash: defaultInitialCash,
            transactionCost: defaultTransactionCost,
            executionDelaySeconds: defaultDelay,
            // validation and error messages
            validStartTime: true,
            checkedStartTime: false,
            startTimeErrorMsg: '',
            validEndTime: true,
            checkedEndTime: false,
            endTimeErrorMsg: '',
            validInitialCash: true,
            initialCashErrorMsg: '',
            checkedInitialCash: false,
            validTransactionCost: true,
            transactionCostErrorMsg: '',
            checkedTransactionCost: false,
            validExecutionDelay: true,
            executionDelayErrorMsg: '',
            checkedExecutionDelay: false,
            validSecuritySet: true,
            securitySetErrorMsg: '',
            checkedSecuritySet: false,
            // UI helpers
            startTimeDisplayString: this.dateToDisplayString(defaultStartTime),
            endTimeDisplayString: this.dateToDisplayString(defaultEndTime),
            minStartTime: minStartTime,
            maxStartTime: maxStartTime,
            minEndTime: minEndTime,
            maxEndTime: maxEndTime,
        }

        // Gives method permission to use this.setState to change the state
        this.buttonClickFunction = this.buttonClickFunction.bind(this);
        this.modalButtonClickFunction = this.modalButtonClickFunction.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.displayStringToDate = this.displayStringToDate.bind(this);
        this.onTickerSelect = this.onTickerSelect.bind(this);
        this.onTickerRemove = this.onTickerRemove.bind(this);
    };

    async getStockSymbols() {
        fetch('stock_symbols')
            .then(response => response.text())
            .then(text => text.split('\n').map(t => Object({ name: t })))
            .then(lines => { this.setState({ tickersAndNames: lines }); })
    }

    onTickerSelect(selected) {
        const toAdd = selected['name'];
        let securitySet = this.state.securitySet;
        if (!securitySet.includes(toAdd)) {
            let i = 0;
            while (toAdd > securitySet[i]) { ++i; }
            securitySet.splice(i, 0, toAdd);
            this.setState({ securitySet: securitySet }, this.validateSecuritySet);
        }
    }

    onTickerRemove(toRemove) {
        let securitySet = this.state.securitySet;
        const i = securitySet.indexOf(toRemove);
        if (i > -1) {
            securitySet.splice(i, 1);
            this.setState({ securitySet: securitySet }, this.validateSecuritySet);
        }
    }

    validateSecuritySet() {
        let validForm = true;
        let securitySetErrorMsg = '';

        if (this.state.securitySet.length === 0) {
            securitySetErrorMsg = 'Choose at least 1 stock';
            validForm = false;
        }

        this.setState({
            securitySetErrorMsg: securitySetErrorMsg,
            checkedSecuritySet: true
        });

        return validForm;
    }

    dateToDisplayString(d) {
        // return date as string in format "yyyy-mm-ddThh:mm" (used in datetime-local input)
        const monthString = this.prependSingleDigitWithZero(d.getMonth() + 1);
        const dayString = this.prependSingleDigitWithZero(d.getDate());
        const hourString = this.prependSingleDigitWithZero(d.getHours());
        const minuteString = this.prependSingleDigitWithZero(d.getMinutes());

        const displayString = ''.concat(d.getFullYear(), '-', monthString, '-', dayString, 'T', hourString, ':', minuteString);
        return displayString;
    }


    prependSingleDigitWithZero(n) {
        // return '0n' if n < 10, otherwise return n as a string.
        return n < 10 ? '0'.concat(n) : String(n)
    }


    displayStringToDate(displayString) {
        // convert a string in format "yyyy-mm-ddThh:mm" to a Date in Eastern timezone
        const parts1 = displayString.split('-');
        const year = Number(parts1[0]);
        const month = Number(parts1[1]) - 1;

        const parts2 = parts1[2].split('T')
        const day = Number(parts2[0])

        // convert Eastern time hour to UTC hour
        const parts3 = parts2[1].split(':')
        const hour = Number(parts3[0]) + 4 + this.isStandardTime(Date.UTC(year, month, day));
        const min = Number(parts3[1]);

        return new Date(Date.UTC(year, month, day, hour, min));
    }


    isStandardTime(time) {
        // return 0 if time T is during Eastern Standard Time, 1 otherwise
        // (doesn't care about hour daylight savings starts, just yyyy/mm/dd)
        if ((Date.UTC(2021, 2, 14) < time) && (time < Date.UTC(2021, 10, 7)) ||
            (Date.UTC(2022, 2, 13) < time) && (time < Date.UTC(2022, 10, 6)) ||
            (Date.UTC(2023, 2, 12) < time) && (time < Date.UTC(2023, 10, 5)) ||
            (Date.UTC(2024, 2, 10) < time) && (time < Date.UTC(2024, 10, 3)) ||
            (Date.UTC(2025, 2, 9) < time) && (time < Date.UTC(2025, 10, 2))
        ) {
            return 0;
        }
        return 1;
    }


    handleDateInput(type) {
        const dateStringName = String(type).concat('DisplayString');
        return (e) => {
            this.setState({
                [type]: this.displayStringToDate(e.target.value),
                [dateStringName]: e.target.value
            }, this.validateDates);
        };
    }


    validateDates() {
        // startTime before endTime, both within NYSE market hours
        let validStart = true;
        let validEnd = true;
        let startMsg = new Array();
        let endMsg = new Array();

        if (this.state.startTime >= this.state.endTime) {
            validStart = false;
            validEnd = false;
            startMsg.push("Start time must be before end time");
        }

        if ((this.state.startTime.getDay() > 5) ||
            (this.state.startTime.getDay() === 0)) {
            validStart = false;
            startMsg.push("Start time must be a weekday");
        }

        if ((this.state.endTime.getDay() > 5) ||
            (this.state.endTime.getDay() === 0)) {
            validEnd = false;
            endMsg.push("End time must be a weekday");
        }

        // no timezone conversion since getHours() returns local time
        if ((this.state.startTime.getHours() < 9) ||
            ((this.state.startTime.getHours() === 9) && (this.state.startTime.getMinutes() < 30))) {
            validStart = false;
            startMsg.push("Cannot start before 9:30am (market open)");
        }

        if (this.state.endTime.getHours() > 16) {
            validEnd = false;
            endMsg.push("Cannot end after 4:00pm (market close)");
        }

        this.setState({
            validStartTime: validStart,
            startTimeErrorMsg: startMsg.join(', '),
            checkedStartTime: true,
            validEndTime: validEnd,
            endTimeErrorMsg: endMsg.join(', '),
            checkedEndTime: true,
        });

        return validStart && validEnd;
    }


    handleInput(type) {
        return (e) => {
            this.setState({ [type]: e.target.value });
        };
    }

    validateForm() {
        // Check that form inputs are in allowed ranges
        let validForm = this.validateDates();
        let initialCashErrorMsg = '';
        let transactionCostErrorMsg = '';
        let executionDelayErrorMsg = '';

        const numericErrorMsg = 'Must be a number at least 0';
        if (Number.isNaN(this.state.initialCash) || this.state.initialCash < 0) {
            initialCashErrorMsg = numericErrorMsg;
            validForm = false;
        }

        if (Number.isNaN(this.state.transactionCost) || this.state.transactionCost < 0) {
            transactionCostErrorMsg = numericErrorMsg;
            validForm = false;
        }

        if (Number.isNaN(this.state.executionDelaySeconds) || this.state.executionDelaySeconds < 0) {
            executionDelayErrorMsg = numericErrorMsg;
            validForm = false;
        }

        this.setState({
            initialCashErrorMsg: initialCashErrorMsg,
            checkedInitialCash: true,
            transactionCostErrorMsg: transactionCostErrorMsg,
            checkedTransactionCost: true,
            executionDelayErrorMsg: executionDelayErrorMsg,
            checkedExecutionDelay: true
        });

        return validForm;
    }

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

    componentDidMount() {
        this.getStockSymbols();
    }

    render() {
        // some javascript code

        let selectedStocks = Array();

        if (this.state.securitySet.length > 0) {
            selectedStocks = this.state.securitySet.map(s =>
                <ListGroup.Item
                    key={s}
                >
                    <Container fluid className="ticker-container">
                        <Row>
                            <Col className="ticker-text">
                                {s}
                            </Col>
                            <Col xs md="1">
                                <CloseButton
                                    className="ticker-cancel-btn"
                                    onClick={(e) => { this.onTickerRemove(s) }}
                                />
                            </Col>
                        </Row>
                    </Container>
                </ListGroup.Item>);
        }

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
                size={'lg'}
            >
                    <Modal.Header closeButton>
                        <Modal.Title>Create Simulation</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <Container
                            className="create-simulation-form"
                        >
                            <Form
                                noValidate
                            >
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                    >
                                        <Form.Label column md>Start time:</Form.Label>
                                        <Col>
                                            <Form.Control
                                                type="datetime-local"
                                                isInvalid={!this.state.validStartTime}
                                                isValid={this.state.checkedStartTime && this.state.validStartTime}
                                                value={this.state.startTimeDisplayString}
                                                onChange={this.handleDateInput('startTime')}
                                                min={this.dateToDisplayString(this.state.minStartTime)}
                                                max={this.dateToDisplayString(this.state.maxStartTime)}
                                            />
                                            <Form.Control.Feedback
                                                type="invalid"
                                            >{this.state.startTimeErrorMsg}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                    >
                                        <Form.Label column md>End time:</Form.Label>
                                        <Col>
                                            <Form.Control
                                                type="datetime-local"
                                                isInvalid={!this.state.validEndTime}
                                                isValid={this.state.checkedEndTime && this.state.validEndTime}
                                                value={this.state.endTimeDisplayString}
                                                onChange={this.handleDateInput('endTime')}
                                                min={this.dateToDisplayString(this.state.minEndTime)}
                                                max={this.dateToDisplayString(this.state.maxEndTime)}
                                            />
                                            <Form.Control.Feedback
                                                type="invalid"
                                            >{this.state.endTimeErrorMsg}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                    >
                                        <Form.Label column md>Initial cash ($):</Form.Label>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                step="100"
                                                min="0"
                                                max="1000000"
                                                isInvalid={this.state.initialCashErrorMsg.length > 0}
                                                isValid={this.state.checkedInitialCash && (this.state.initialCashErrorMsg.length === 0)}
                                                value={this.state.initialCash}
                                                onChange={this.handleInput('initialCash')}
                                            />
                                            <Form.Control.Feedback
                                                type="invalid"
                                            >{this.state.initialCashErrorMsg}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                        controlId="tickerSearch"
                                    >
                                        <Form.Label column md>Stocks to trade:</Form.Label>
                                        <Col>
                                            <FuzzySearch
                                                className="ticker-search"
                                                list={this.state.tickersAndNames}
                                                keys={['name']}
                                                onSelect={(e) => { this.onTickerSelect(e) }}
                                                keyForDisplayName={'name'}
                                                maxResults={7}
                                                placeholder={'Search stocks'}
                                            />
                                            <span className='ticker-error'>{this.state.securitySetErrorMsg}</span>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                    >
                                        <Form.Label column md>Selected stocks:</Form.Label>
                                        <Col>
                                            <ListGroup
                                                style={{ width: '430px' }}
                                            >
                                                {selectedStocks}
                                            </ListGroup>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                    >
                                        <Form.Label column md>Transaction cost ($):</Form.Label>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                isInvalid={this.state.transactionCostErrorMsg.length > 0}
                                                isValid={this.state.checkedTransactionCost && (this.state.transactionCostErrorMsg.length === 0)}
                                                value={this.state.transactionCost}
                                                onChange={this.handleInput('transactionCost')}
                                            />
                                            <Form.Control.Feedback
                                                type="invalid"
                                            >{this.state.transactionCostErrorMsg}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Row>
                                <Row>
                                    <Form.Group
                                        as={Row}
                                        md
                                    >
                                        <Form.Label column md>Execution delay (sec):</Form.Label>
                                        <Col>
                                            <Form.Control
                                                type="number"
                                                min="0"
                                                isInvalid={this.state.executionDelayErrorMsg.length > 0}
                                                isValid={this.state.checkedExecutionDelay && (this.state.executionDelayErrorMsg.length === 0)}
                                                value={this.state.executionDelaySeconds}
                                                onChange={this.handleInput('executionDelaySeconds')}
                                            />
                                            <Form.Control.Feedback
                                                type="invalid"
                                            >{this.state.executionDelayErrorMsg}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Group>
                                </Row>
                            </Form>
                        </Container>
                    </Modal.Body>
                    
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.modalButtonClickFunction}>
                            Create!
                        </Button>
                    </Modal.Footer>
            </Modal>
        </div>
        );
    }

}

export default Homepage;
