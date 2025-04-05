
// Resolves an article from its CID, check the content, display
function ArticleCard({ article }) {
    return ( 
        <div style={{ padding: "1rem", minWidth: "450px", height: "450px", boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)", }}>
            <p>{ article?.ipfsHash }</p>
        </div>
     );
}

export default ArticleCard;