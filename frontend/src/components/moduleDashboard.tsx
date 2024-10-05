import React from 'react';
const modules = require('@/config/modules.json');

const ModuleDashboard: React.FC = () => {
    return (
        <div className='d-flex' itemID='md-d1'>
            <div className='row row-cols-md-3 g-3'>
                {modules.enabledModules.map((module: { path: string; name: string; description: string | undefined; }, idx: number) => (
                    <div className='col' itemID={idx.toString(36)}>
                        <div className='card d-flex text-center'>
                            <a href={module.path} className='link-underline link-underline-opacity-0 link-body-emphasis'>
                                <div className='card-body'>
                                    <h5 className='card-title'>{module.name}</h5>
                                    <p className='card-text'>{module.description}</p>
                                </div>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ModuleDashboard;