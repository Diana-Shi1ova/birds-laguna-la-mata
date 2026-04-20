import './Tabs.css';


function Tabs({tabs = [], activeTab, onChange}) {
    return (
        <ul className="horizontal-tabs">
        {tabs.map(tab => (
            <li key={tab.value}>
            <button
                className={activeTab === tab.value ? 'active' : ''}
                onClick={() => onChange?.(tab.value)}
            >
                {tab.label}
            </button>
            </li>
        ))}
        </ul>
    );
}

export default Tabs;