import './Tabs.css';
import { useNavigate } from 'react-router-dom';


function Tabs({tabs = [], activeTab, onChange}) {
    const navigate = useNavigate();

    return (
        <ul className="horizontal-tabs">
        {tabs.map(tab => (
            <li key={tab.value}>
            <button
                className={activeTab === tab.value ? 'active' : ''}
                onClick={() => {
                    onChange?.(tab.value);
                    if (tab.url) {
                        navigate(tab.url);
                    }
                }}
            >
                {tab.label}
            </button>
            </li>
        ))}
        </ul>
    );
}

export default Tabs;