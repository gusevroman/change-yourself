import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

import { logout, changeColor } from "../../../redux/actions";
import { showProfile } from "../../../redux/actions";
import FilesUpload from "./files-upload";
import Chart from "./chart";

class Profile extends Component {
  constructor() {
    super();
    this.logout = this.logout.bind(this);
    this.inputHandler = this.inputHandler.bind(this);
    this.setProfile = this.setProfile.bind(this);
  }

  state = {
    name: "",
    email: "",
    tel: "",
    instagram: "",
    about: "",
    profileImg: false,
    deleteAccount: false,
    close: true,
    
    
    checkBoxValue: false,

        chartData: {
            labels: [], //name
            datasets: [{
                label: "Student A",
                backgroundColor: ["rgba(200,0,0,0.2)", "rgba(30,10,0.2)"],
                data: [1, 2] //number
            }]
        }
  };

  logout() {
    this.props.logout();
    this.props.history.push("/");
  }

  
    async componentDidMount() {
        await this.getProfile();
        let id = this.props.userId;
        const response = await fetch('http://localhost:5000/chart', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({id})
        });

        let newResponse = await response.json();
        let newArrCategory = [];
        newResponse.forEach(elem => newArrCategory.push(elem.category));

        let a = newArrCategory.flat();
        let newUniqArr = [];
        for (let str of a) {
            if (!newUniqArr.includes(str)) {
                newUniqArr.push(str);
            }
        }
        let result = a.reduce(function(acc, el) {
            acc[el] = (acc[el] || 0) + 1;
            return acc;
        }, {});


        let newChartData = {...this.state.chartData};

        console.log('массив ключей', Object.keys(result));
        newChartData.labels = Object.keys(result);
        newChartData.datasets.data = Object.values(result)
            this.setState({
            chartData: newChartData
        })
    }
  

  componentWillUnmount() {}

  showDanger = () => {
    this.setState({
      deleteAccount: !this.state.deleteAccount
    });
  };

  deleteAccount = async () => {
    let id = this.props.userId;
    this.props.logout();
    this.props.history.push("/");
    await fetch("http://localhost:5000/user/deleteAccount", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({ id })
    });
  };

  async getProfile() {
    const profile = await (
      await fetch(
        `http://localhost:5000/user/profile/${this.props.isLoggined}`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json"
          }
        }
      )
    ).json();
    this.props.showProfile(profile);
    console.log(profile);

    this.setState(profile);
  }

  setProfile(event) {
    event.preventDefault();
    const { name, about, email, tel, instagram } = event.target;
    this.postData(
      name.value,
      about.value,
      email.value,
      tel.value,
      instagram.value
    );
  }

  postData(name, about, email, tel, instagram) {
    const login = this.props.isLoggined;
    fetch(`http://localhost:5000/user/profile/edit/`, {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({ login, name, about, email, tel, instagram })
      }).then(()=>{
        this.props.history.push('/user/profile');
      });
  }

  inputHandler(event) {
    const { value, name } = event.target;
    this.setState({ [name]: value });
  }

  renderProfile() {
    const { name, profileImg, about, email, tel, instagram } = this.state;
    let profileImgAvatar;    
    let img = false;
    if (profileImg){
      profileImgAvatar = `http://localhost:5000/${profileImg}`;
      img = `http://localhost:5000/${profileImg}`;
    }else {
      profileImgAvatar = "https://www.windstream.com/getmedia/b2e4e38a-7cb6-4ca9-9544-54dfeaca6304/icon_user-circle.png?width=1920&height=1280&ext=.png";
    }

    return (
      <div className="profile">
        <form
          method="POST"
          action="/user/profile/edit"
          onSubmit={this.setProfile}
        >
          <div className="profile__main">
            <FilesUpload img={img} reload={(img)=>{this.setState({profileImg: img}) }}/>
          </div>

          <h3 className="profile__input">
            <span>Имя</span>
            <input
              className="search__input"
              name="name"
              id="name"
              type="text"
              value={name}
              onChange={this.inputHandler}
            />
          </h3>

          <h3 className="profile__input">
            <span>Email</span>
            <input
              className="search__input"
              name="email"
              id="email"
              type="text"
              value={email}
              onChange={this.inputHandler}
            />
          </h3>

          <h3 className="profile__input">
            <span>Обо мне</span>
            <input
              className="search__input"
              name="about"
              id="about"
              type="text"
              value={about}
              onChange={this.inputHandler}
            />
          </h3>

          <h3 className="profile__input">
            <span>Телефон</span>
            <input
              className="search__input"
              name="tel"
              id="tel"
              type="text"
              value={tel}
              onChange={this.inputHandler}
            />
          </h3>

          <h3 className="profile__input">
            <span>Инстаграм</span>
            <input
              className="search__input"
              name="instagram"
              id="instagram"
              type="text"
              value={instagram}
              onChange={this.inputHandler}
            />
          </h3>

          <div className="row">
            <button className="edit" type="submit">
              Сохранить изменения
            </button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    console.log(this.state.profileImg);
    
    return (
      <>
        {this.renderProfile()}
      
      {this.state.chartData.labels.length !== 0 ?
                <div style={{display: 'flex', justifyContent: 'space-around', height: 300}}>
                    <div style={{width: '50%'}}>
                        <Chart chartData={this.state.chartData} displayTitle="false"/>
                    </div>
                    <div style={{width: '50%'}}>
                        <Chart chartData={this.state.chartData} displayTitle="false"/>
                    </div>
                </div> : null}
      
      <li className="tg-list-item">
                                <p>Включить уведомления</p>
                                <input className="tgl tgl-light" checked={this.state.checkBoxValue}
                                       onChange={this.soldCheckbox} id="cb1" type="checkbox"/>
                                <label className="tgl-btn" htmlFor="cb1"></label>
                            </li>
      
        {this.state.deleteAccount ? (
              <div className="edit-block">
                <span>Вы точно хотите удалить аккаунт?</span>
                <div>
                  <i className="icono-check" onClick={this.deleteAccount}></i>
                  <i className="icono-cross" onClick={this.showDanger}></i>
                </div>
              </div>
            ) : (
              <button
                onClick={this.showDanger}
                className="delete"
                type="submit"
              >
                Удалить аккаунт
              </button>
            )}
      </>
    );
  }

}

const mapStateToProps = state => ({
    isLoggined: state.isLoggined,
    userId: state.userId,
    profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  showProfile: profile => dispatch(showProfile(profile)),
  changeColor: color => dispatch(changeColor(color))
});

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(Profile)
);
