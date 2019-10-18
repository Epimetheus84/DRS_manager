import React from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import Delete from '@material-ui/icons/Delete'
import ArrowBack from '@material-ui/icons/ArrowBack'
import ArrowForward from '@material-ui/icons/ArrowForward'
import SettingsApplications from '@material-ui/icons/SettingsApplications'
import { Link } from "react-router-dom"

import ImagesList from "./ImagesList"
import Log from "./Log"

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            srcImages: {},
            dstImages: {},
            selectedDev: [],
            selectedProd: [],
            logs: [],
            semWaiting: 2,
            configs: {
                src_registry: {
                    ADDRESS: ''
                },
                dst_registry: {
                    ADDRESS: ''
                }
            }
        }
        axios.get('/api/get_settings').then(res => {
            this.setState({
                configs: res.data
            })
        })
        this.getReposData()
        this.log = this.log.bind(this)
    }

    getReposData() {
        axios.get('/api/images/src').then(res => {
            const images = res.data
            this.setState({
                srcImages: images,
                semWaiting: this.state.semWaiting - 1
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                semWaiting: this.state.semWaiting - 1
            })
        })

        axios.get('/api/images/dst').then(res => {
            const images = res.data
            this.setState({
                dstImages: images,
                semWaiting: this.state.semWaiting - 1
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                semWaiting: this.state.semWaiting - 1
            })
        })
    }

    handleChangeMultiple(event) {
        const { options } = event.target;
        const value = [];
        for (let i = 0, l = options.length; i < l; i += 1) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        return value
    }

    moveImages(image) {
        const { selectedDev, selectedProd } = this.state
        let selected = selectedDev
        let url = 'dst'

        if (selectedProd.length > 0) {
            selected = selectedProd
            url = 'src'
        }

        if (selected.length === 0) alert('Choose image(s)');

        this.setState({
            semWaiting: 2
        })

        let proceed = 0
        for (const image of selected) {
            this.log(image + ' - копируется на ' + url)
            axios.post('/api/move/to_' + url, {
                image: image
            }).then(res => {
                if (++proceed === selected.length) this.getReposData()
                this.log(image + ' - скопирован на ' + url, 'success')
            }).catch(err => {
                console.log(err)
                if (++proceed === selected.length) this.getReposData()
                this.log(image + ' - ошибка во время копирования на ' + url, 'error')
            })
        }
    }

    removeImages() {
        console.log('asd')
        const { selectedDev, selectedProd } = this.state
        let selected = selectedDev
        let url = 'src'
        if (selectedProd.length > 0) {
            selected = selectedProd
            url = 'dst'
        }
        if (selected.length === 0) {
            alert('Choose image(s)')
            return
        }

        if (!window.confirm('Вы уверены что хотите удалить эти теги?: \n' + selected.join(';\n'))) return

        this.setState({
            semWaiting: 2
        })

        let proceed = 0

        axios.post('/api/check_if_can_be_removed/' + url, {
            images: selected
        }).then(res => {
            let confirmed = 1
            if (Object.keys(res.data).length > 0) {
                let duplicatesConfirmationString = 'Внимание! \n' +
                    'Удалив следующие теги, вы также удалите и их дупликаты.'

                for (const image in res.data) {
                    if (!res.data.hasOwnProperty(image) || Array.isArray(res.data)) continue
                    const duplicates = res.data[image]
                    duplicatesConfirmationString += '\nДля тега ' + image
                    + ' дупликаты:\n'
                    + duplicates.join('\n')
                }

                duplicatesConfirmationString += '\nПродолжить?'

                confirmed = window.confirm(duplicatesConfirmationString)
            }

            if (!confirmed) {
                this.getReposData()
                return
            }

            for (const image of selected) {
                this.log(image + ' - удаляется с реестра ' + url)
                axios.post('/api/remove/' + url, {
                    image: image
                }).then(res => {
                     this.log(image + ' - удален с реестра ' + url)
                     if (++proceed === selected.length) this.getReposData()
                }).catch(err => {
                     console.log(err)
                     this.log(image + ' - ошибка во время удаления с реестра ' + url)
                     if (++proceed === selected.length) this.getReposData()
                })
            }
        }).catch(err => {
            console.log(err)
            this.getReposData()
        })
    }

    log(value, status = 'default') {
        const currentDate = new Date()
        const log = {
            time: currentDate.getHours() + ':'
                + currentDate.getMinutes() + ':'
                + currentDate.getSeconds(),
            value,
            status
        }
        let logs = this.state.logs
        logs.unshift(log)
        this.setState({
            logs: logs
        })
    }

    render() {
        const {srcImages, dstImages, selectedDev, selectedProd, semWaiting, configs} = this.state
        return (
            <div className='App'>
                { semWaiting > 0 && <div className='preloader'>
                    <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
                </div> }
                <div className='images-list'>
                    <ImagesList
                        images={srcImages}
                        title={'src ' + configs.src_registry.ADDRESS}
                        selected={selectedDev}
                        handleChange={(event) => {
                            this.setState({
                                selectedProd: [],
                                selectedDev: this.handleChangeMultiple(event)
                            })
                        }}
                    />
                </div>
                <div className='actions-list'>
                    { selectedDev.length > 0 && <div className='button-wrapper'>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>{this.moveImages()}}
                            endIcon={<ArrowForward />}
                        >
                            Копировать на dst
                        </Button>
                    </div>}
                    { selectedProd.length > 0 && <div className='button-wrapper'>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={()=>{this.moveImages()}}
                            startIcon={<ArrowBack />}
                        >
                            Копировать на src
                        </Button>
                    </div>}
                    <div className='button-wrapper'>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={()=>{this.removeImages()}}
                            endIcon={<Delete />}
                        >
                            Удалить
                        </Button>
                    </div>
                </div>
                <div className='images-list'>
                    <ImagesList
                        images={dstImages}
                        title={'dst ' + configs.dst_registry.ADDRESS}
                        selected={selectedProd}
                        handleChange={(event) => {
                            this.setState({
                                selectedDev: [],
                                selectedProd: this.handleChangeMultiple(event)
                            })
                        }}
                    />
                </div>
                <div className="settings-btn">
                    <Link to="/settings">
                        <SettingsApplications />
                    </Link>
                </div>
                <div className="logs">
                    <Log data={this.state.logs} />
                </div>
            </div>
        );
    }
}

export default Home