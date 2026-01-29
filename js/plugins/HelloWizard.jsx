

import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import SideBar from 'qwc2/components/SideBar';
import './style/HelloWizard.css';
import axios from 'axios';

/**
 * HelloWizard - A custom wizard plugin for demonstrating:
 * - Multi-step workflows
 * - API integration (mock)
 * - Form handling
 * - State management
 */
class HelloWizard extends React.Component {
    static propTypes = {
        /** The side of the application on which to display the sidebar. */
        side: PropTypes.string
    };
    
    static defaultProps = {
        side: 'right'
    };

    state = {
        step: 1,
        loading: false,
        data: {
            name: '',
            email: '',
            preference: 'option1'
        },
        apiResponse: null,
        error: null
    };

    render() {
        return (
            <SideBar 
                icon="info" 
                id="HelloWizard" 
                side={this.props.side} 
                title="Hello Wizard - POC" 
                width="30em"
                minWidth="300px"
            >
                {() => ({
                    body: this.renderBody()
                })}
            </SideBar>
        );
    }

    renderBody = () => {
        if (this.state.loading) {
            return (
                <div className="hellowizard-loading">
                    <div className="hellowizard-spinner"></div>
                    <p>Loading data from API...</p>
                </div>
            );
        }

        return (
            <div className="hellowizard-body">
                {/* Progress indicator */}
                <div className="hellowizard-progress">
                    <div className={`hellowizard-progress-step ${this.state.step >= 1 ? 'active' : ''}`}>1</div>
                    <div className={`hellowizard-progress-line ${this.state.step >= 2 ? 'active' : ''}`}></div>
                    <div className={`hellowizard-progress-step ${this.state.step >= 2 ? 'active' : ''}`}>2</div>
                    <div className={`hellowizard-progress-line ${this.state.step >= 3 ? 'active' : ''}`}></div>
                    <div className={`hellowizard-progress-step ${this.state.step >= 3 ? 'active' : ''}`}>3</div>
                </div>

                {/* Step title */}
                <h2 className="hellowizard-title">Step {this.state.step} of 3</h2>

                {/* Error display */}
                {this.state.error && (
                    <div className="hellowizard-error">
                        ⚠️ {this.state.error}
                    </div>
                )}

                {/* Step content */}
                <div className="hellowizard-content">
                    {this.renderStepContent()}
                </div>

                {/* Navigation buttons */}
                <div className="hellowizard-actions">
                    {this.state.step > 1 && (
                        <button 
                            className="hellowizard-btn hellowizard-btn-secondary" 
                            onClick={this.previousStep}
                        >
                            ← Previous
                        </button>
                    )}
                    {this.state.step < 3 ? (
                        <button 
                            className="hellowizard-btn hellowizard-btn-primary" 
                            onClick={this.nextStep}
                        >
                            Next →
                        </button>
                    ) : (
                        <button 
                            className="hellowizard-btn hellowizard-btn-success" 
                            onClick={this.submitToAPI}
                        >
                            Submit to API ✓
                        </button>
                    )}
                </div>
            </div>
        );
    };

    renderStepContent = () => {
        switch (this.state.step) {
            case 1:
                return this.renderStep1();
            case 2:
                return this.renderStep2();
            case 3:
                return this.renderStep3();
            default:
                return null;
        }
    };

    renderStep1 = () => {
        return (
            <div className="hellowizard-step">
                <h3>👤 User Information</h3>
                <p>Please enter your basic information</p>
                
                <div className="hellowizard-field">
                    <label>Name:</label>
                    <input 
                        type="text" 
                        placeholder="Enter your name"
                        value={this.state.data.name}
                        onChange={(e) => this.updateField('name', e.target.value)}
                    />
                </div>

                <div className="hellowizard-field">
                    <label>Email:</label>
                    <input 
                        type="email" 
                        placeholder="your.email@example.com"
                        value={this.state.data.email}
                        onChange={(e) => this.updateField('email', e.target.value)}
                    />
                </div>
            </div>
        );
    };

    renderStep2 = () => {
        return (
            <div className="hellowizard-step">
                <h3>⚙️ Preferences</h3>
                <p>Choose your preferred option</p>
                
                <div className="hellowizard-field">
                    <label>
                        <input 
                            type="radio" 
                            name="preference" 
                            value="option1"
                            checked={this.state.data.preference === 'option1'}
                            onChange={(e) => this.updateField('preference', e.target.value)}
                        />
                        Option 1 - Basic
                    </label>
                </div>

                <div className="hellowizard-field">
                    <label>
                        <input 
                            type="radio" 
                            name="preference" 
                            value="option2"
                            checked={this.state.data.preference === 'option2'}
                            onChange={(e) => this.updateField('preference', e.target.value)}
                        />
                        Option 2 - Advanced
                    </label>
                </div>

                <div className="hellowizard-field">
                    <label>
                        <input 
                            type="radio" 
                            name="preference" 
                            value="option3"
                            checked={this.state.data.preference === 'option3'}
                            onChange={(e) => this.updateField('preference', e.target.value)}
                        />
                        Option 3 - Pro
                    </label>
                </div>
            </div>
        );
    };

    renderStep3 = () => {
        return (
            <div className="hellowizard-step">
                <h3>📋 Summary</h3>
                <p>Please review your information before submitting</p>
                
                <div className="hellowizard-summary">
                    <div className="hellowizard-summary-item">
                        <strong>Name:</strong> {this.state.data.name || '(not provided)'}
                    </div>
                    <div className="hellowizard-summary-item">
                        <strong>Email:</strong> {this.state.data.email || '(not provided)'}
                    </div>
                    <div className="hellowizard-summary-item">
                        <strong>Preference:</strong> {this.state.data.preference}
                    </div>
                </div>

                {this.state.apiResponse && (
                    <div className="hellowizard-success">
                        <h4>✅ Success!</h4>
                        <p>API Response:</p>
                        <pre>{JSON.stringify(this.state.apiResponse, null, 2)}</pre>
                    </div>
                )}
            </div>
        );
    };

    updateField = (field, value) => {
        this.setState({
            data: {
                ...this.state.data,
                [field]: value
            },
            error: null
        });
    };

    nextStep = () => {
        // Validation
        if (this.state.step === 1) {
            if (!this.state.data.name.trim()) {
                this.setState({error: 'Please enter your name'});
                return;
            }
            if (!this.state.data.email.trim()) {
                this.setState({error: 'Please enter your email'});
                return;
            }
        }

        this.setState({
            step: this.state.step + 1,
            error: null
        });
    };

    previousStep = () => {
        this.setState({
            step: this.state.step - 1,
            error: null
        });
    };
/*
    submitToAPI = () => {
        this.setState({loading: true, error: null});

        // Mock API call - remplace par ta vraie API
        this.submitToAPI(this.state.data)
            .then(response => {
                this.setState({
                    loading: false,
                    apiResponse: response
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: 'API Error: ' + error.message
                });
            });
    }; */

    // Mock API - Remplace ça par axios.post() vers ta vraie API
    mockAPICall = (data) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simule une réponse API
                if (Math.random() > 0.1) {  // 90% success rate
                    resolve({
                        success: true,
                        message: 'Data received successfully',
                        data: data,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error('Random API error'));
                }
            }, 1500);  // Simule 1.5s de latence
        });
    };


    submitToAPI = () => {
        this.setState({loading: true, error: null});

        // Appel à ton API Python
        axios.post('http://localhost:5000/api/wizard/submit', this.state.data)
            .then(response => {
                this.setState({
                    loading: false,
                    apiResponse: response.data
                });
            })
            .catch(error => {
                console.error('API Error:', error);
                this.setState({
                    loading: false,
                    error: error.response?.data?.error || 'API Error: ' + error.message
                });
            });
    };

}

export default connect(() => ({}), {})(HelloWizard);