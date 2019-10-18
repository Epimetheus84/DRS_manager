import React from 'react'
import axios from 'axios'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import ArrowBack from '@material-ui/icons/ArrowBack'
import { Link } from "react-router-dom"

class Settings extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            configs: {},
            saving: false
        }
        axios.get('/api/get_settings').then(res => {
            this.setState({
                configs: res.data
            })
        })
    }

    handleChange(value, key, subkey) {
        const { configs } = this.state
        if (!! subkey) {
            configs[key][subkey] = value
        } else {
            configs[key] = value
        }
        this.setState({
            configs: configs
        })
    }

    save() {
        this.setState({saving: true})
        axios.post('/api/save_settings', this.state.configs).then(res => {
            this.setState({saving: false})
        }).catch((err) => {
            this.setState({saving: false})
            alert(err)
        })
    }

    render() {
        const { configs } = this.state
        if (!!!configs.src_registry) return 'Waiting...'
        return (
            <form noValidate autoComplete="off" className="settings-form">
                <h2>Настройки синхронизации</h2>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="src_address"
                        label="SRC Address"
                        value={configs.src_registry.ADDRESS}
                        onChange={(e) => { this.handleChange(e.target.value, 'src_registry', 'ADDRESS')}}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="src_login"
                        label="SRC Auth username"
                        value={configs.src_registry.USERNAME}
                        onChange={(e) => { this.handleChange(e.target.value, 'src_registry', 'USERNAME')}}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="src_password"
                        label="SRC Password"
                        value={configs.src_registry.PASSWORD}
                        onChange={(e) => { this.handleChange(e.target.value, 'src_registry', 'PASSWORD')}}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="dst_address"
                        label="DST Address"
                        value={configs.dst_registry.ADDRESS}
                        onChange={(e) => { this.handleChange(e.target.value, 'dst_registry', 'ADDRESS')}}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="dst_username"
                        label="DST Auth username"
                        value={configs.dst_registry.USERNAME}
                        onChange={(e) => { this.handleChange(e.target.value, 'dst_registry', 'USERNAME')}}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="dst_password"
                        label="DST Password"
                        value={configs.dst_registry.PASSWORD}
                        onChange={(e) => { this.handleChange(e.target.value, 'dst_registry', 'PASSWORD')}}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="repositories"
                        label={ 'Необходимые репозитории через запятую' +
                            '(оставьте поле пустым, если нужны все репозитории)' }
                        value={
                            configs.repositories.join(', ')
                        }
                        onChange={(e) => {
                            let value = e.target.value
                            value = value.split(', ')
                            this.handleChange(value, 'repositories')
                        }}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <TextField
                        fullWidth
                        id="prefixes"
                        label={ 'Префиксы тегов через запятую' +
                            '(оставьте пустым, если нужны все теги)' }
                        value={
                            configs.prefixes.join(', ')
                        }
                        onChange={(e) => {
                            let value = e.target.value
                            value = value.split(', ')
                            this.handleChange(value, 'prefixes')
                        }}
                        margin="normal"
                    />
                </FormGroup>
                <FormGroup row>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={configs.force_sync}
                                onChange={(e) => { this.handleChange(e.target.checked, 'force_sync')}}
                                value="force_sync"
                                inputProps={{
                                    'aria-label': 'primary checkbox',
                                }}
                            />
                        }
                        label="Удалять дублирующиеся теги"
                    />
                </FormGroup>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={()=>{this.save()}}
                >
                    { this.state.saving === false ? 'Сохранить' : 'Сохраняется...' }
                </Button>
                <Link to="/" className="return-btn">
                    <Button
                        variant="contained"
                        color="default"
                        startIcon={<ArrowBack />}
                    >
                        Вернуться
                    </Button>
                </Link>
            </form>
        )
    }
}

export default Settings