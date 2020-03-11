import React from "react";
import './icono.min.css'
import AddNewDay from "./AddNewDay";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";


class NewMethodForm extends React.Component {

    state = {
        title: '',
        description: '',
        category: '',
        tag: '',
        author: this.props.isLoggined,
        days: [
            {
                title: 1,
                description: '',
                task: ''
            }
        ]
    };

    selectValue = (value) => {
        this.setState({
            category: value
        })
    };


    plusDay = (event) => {
        event.preventDefault();
        let newArr = [...this.state.days];

        newArr.push({
            title: this.state.days.length + 1,
            description: '',
            task: ''
        });
        this.setState({
            days: newArr
        })
    };

    firstInputValue = (event) => {
        event.preventDefault();
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: [value]
        });
    };

    inputValue = (index, day) => {
        let days = [...this.state.days];
        days[index] = day;
        this.setState({
            days
        });

    };

    sendForm = async (event) => {
        event.preventDefault();

        const response = await fetch('http://localhost:5000/newMethod', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(this.state)

        });
    };

    deleteDay = (event) => {
        event.preventDefault();
        let newDays = [...this.state.days];
        newDays.pop();
        this.setState({
            days: newDays
        })
    };

    render() {
        let uniqArr = ['Спорт', 'Образование', 'Хобби', 'Здоровье'];
        return (
            <div className="box">
                <form id="form" className="topBefore">


                    <input onChange={this.firstInputValue} placeholder="НАЗВАНИЕ МЕТОДА"
                           value={this.state.title}
                           name='title'
                           type="text"
                           required
                    />


                    <textarea onChange={this.firstInputValue} placeholder='ОПИСАНИЕ'
                              value={this.state.description}
                              name="description"
                              type="text"
                              required/>


                    <input className="inputClass" placeholder="УКАЖИТЕ ТЭГИ" onChange={this.firstInputValue}
                           value={this.state.tag}
                           name="tag" type="text"/>


                    <div className="selectContainer"><select className="addSelect" onChange={(elem) => this.selectValue(elem.target.value)}>
                        <option>Выберите категорию</option>
                        {uniqArr.map(elem => {
                            return <option value={elem}>{elem}</option>
                        })}
                    </select>
                    </div>




                    {this.state.days.length > 1 ?
                        <>
                            <div>{this.state.days.map((elem) => {
                                return <AddNewDay day={elem} inputValueDays={this.inputValue}/>
                            })
                            }
                            </div>
                            <div className='logoTrash'>
                                <i onClick={this.deleteDay} className="icono-trash"></i>
                            </div>

                        {/*<button onClick={this.deleteDay}>удалить день</button>*/}
                        </>
                        : <div>{this.state.days.map((elem) => {
                            return <AddNewDay day={elem} inputValueDays={this.inputValue}/>
                        })
                        }
                        </div>}



                    <div className="buttonContainer">
                        <button className="outline orange oneButton" onClick={this.plusDay}>Добавить день</button>
                        <button className="outline orange oneButton" onSubmit={this.sendForm}>Отправить</button>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    isLoggined: state.isLoggined,
    login: state.login,
    allPoints: state.allPoints
});

const mapDispatchToProps = dispatch => ({});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(NewMethodForm)
);
