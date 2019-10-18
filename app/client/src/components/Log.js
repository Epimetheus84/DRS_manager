import React from 'react'

class Log extends React.Component {
    render() {
        const {data} = this.props
        return (
            <div>
                {Object.values(data).map(log => {
                    return <div><span className="time">{log.time}</span><span className={log.status}>{log.value}</span></div>
                })}
            </div>
        )
    }
}

export default Log