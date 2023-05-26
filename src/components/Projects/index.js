import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Header from '../Header'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Projects extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    activeOption: categoriesList[0].id,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjectDetails()
  }

  getProjectDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {activeOption} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeOption}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const data = await response.json()
      const fetchedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))

      this.setState({
        projectsList: fetchedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelect = event => {
    this.setState({activeOption: event.target.value}, this.getProjectDetails)
  }

  onClickRetry = () => {
    this.getProjectDetails()
  }

  renderLoaderView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderProjectsSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="projects-list-container">
        {projectsList.map(eachProject => (
          <li className="project-item" key={eachProject.id}>
            <div className="project-item-container">
              <img
                src={eachProject.imageUrl}
                alt={eachProject.name}
                className="project-icon"
              />
              <p className="project-name">{eachProject.name}</p>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-desc">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="retry-button"
        onClick={this.onClickRetry}
      >
        Retry
      </button>
    </div>
  )

  renderProjectsApiStatus = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoaderView()
      case apiStatusConstants.success:
        return this.renderProjectsSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    const {activeOption} = this.state
    return (
      <div className="app-container">
        <Header />
        <div className="projects-container">
          <select
            value={activeOption}
            className="select-element"
            onChange={this.onChangeSelect}
          >
            {categoriesList.map(eachItem => (
              <option key={eachItem.id} value={eachItem.id}>
                {eachItem.displayText}
              </option>
            ))}
          </select>
          {this.renderProjectsApiStatus()}
        </div>
      </div>
    )
  }
}

export default Projects
