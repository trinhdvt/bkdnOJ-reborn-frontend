import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.scss';
import uniFlag from 'assets/images/bkdn-uni-flag.png';

/*
    FOOTER
    ------- | ------------------------
    School  |   Link Categories
    Info    |   Cate 1 ------
            |    > link  > link
    ------- | ------------------------
        Thankyou, creator,
          inspiration...

*/

export default class Footer extends React.Component {
    render() {
        return (
            <footer className='footer'>
                <Container>
                    <Row className="upper-row">
                        <Col xs={12} md={4} className="col school-info-section">
                            <p className="bkdn-uni-container">
                                <img className='bkdn-uni-flag' src={uniFlag} alt="Flag of Danang University of Science and Technology"/>
                            </p>
                        </Col>

                        <Col xs={12} md={8} className="col link-section">
                            <div className="subcategory">
                                <h4>Title 1</h4>
                                <p>
                                    <a href="#">Link 1</a>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                </p>
                            </div>

                            <div className="subcategory">
                                <h4>Title 2</h4>
                                <p>
                                    <a href="#">Link 1</a>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                    <a href="#">Link 3</a>
                                    <a href="#">Link 3</a>
                                    <a href="#">Link 3</a>
                                </p>
                            </div>

                            <div className="subcategory">
                                <h4>Title 3</h4>
                                <p>
                                    <a href="#">Link 1</a>
                                    <a href="#">Link 2</a>
                                    <a href="#">Link 3</a>
                                </p>
                            </div>
                        </Col>
                    </Row>

                    <Row className="lower-row">
                        <Col xs={12} className="col">
                            <pre id="footer-note">
                                Bach Khoa Da Nang Online Judge - bkdnOJ v2.0 © 2022{"\n"}
                                Built by BKDN's Informatics Olympic and ICPC Team{"\n"}
                                University of Science and Technology - University of Danang{"\n"}
                            </pre>
                        </Col>
                    </Row>
                </Container>
            </footer>
        )
    }
}