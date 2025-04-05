
// Resolves an article from its CID, check the content, display
function ArticleCard({ article }) {
    return ( 
        <div style={{ border: "1px solid black", padding: "1rem", minWidth: "500px", height: "500px" }}>
            <p>{ article?.ipfsHash }</p>
        </div>
     );
}

export default ArticleCard;