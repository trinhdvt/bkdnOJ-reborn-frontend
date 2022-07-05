import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { FaUniversity } from 'react-icons/fa';
import defaultOrgImg from 'assets/images/default-org.png';

import './UserCard.scss';

class UserCard extends React.Component {

  static findRankByRating(rating, ranks) {
    if (!rating) return {
      'rank': "Unrated",
      'rank_class': "rate-unrated",
    }

    let lo=0, hi=ranks.length-1;
    let ans=0;
    while (lo <= hi) {
      let mid = Math.floor((lo+hi)/2);
      if (ranks[mid].rating_floor <= rating) {
        ans = mid;
        lo = mid + 1
      } else {
        hi = mid - 1;
      }
    }
    return ranks[ans];
  }

  render() {
    const {user, displayMode, organization} = this.props;
    const rank_obj = UserCard.findRankByRating(user.rating, this.props.ranks);

    const orgImg = ((organization && organization.logo_url) || defaultOrgImg) || null;
    const orgName = (organization && (organization.short_name || organization.slug)) || null;
    const userImg = (user.avatar);

    let realname = "";
    [user.first_name, user.last_name].forEach((st) => {
      if (!st) return;
      if (realname) realname += " ";
      realname += st;
    })

    return (
      <div className="flex-center participant-container" style={{justifyContent: "center"}}>
        <div className="avatar-container">
          {
            displayMode === 'user'
            ? <img className="avatar-img" src={user.avatar} alt="User Icon"></img>
            : <img className="avatar-img" src={orgImg} alt="Org Icon"></img>
          }
        </div>
        <div className="flex-center-col user-container">
          <div className="acc-username text-truncate"
            data-toggle="tooltip" data-placement="right" title={`${rank_obj.rank} ${user.username}`}>
            <p className={`${rank_obj.rank_class} username`}>{user.username}</p>
          </div>
          {realname.length > 0 &&
            <div className="text-left acc-realname text-truncate">
              {realname}
            </div>
          }
          {!(displayMode === 'user') && (
            orgName ? <div className="text-left acc-org text-truncate"
              data-toggle="tooltip" data-placement="right" title={`${organization.name}`}>
              <FaUniversity/> {orgName}
            </div> : <div className="text-left acc-org text-truncate"
              data-toggle="tooltip" data-placement="right" title={`This user hasn't set their Display Organization.`}>
                None
            </div>
          )}
        </div>
      </div>
    )
  }
}

UserCard.propTypes = {
  user: PropTypes.exact({
    username: PropTypes.string,
    rating: PropTypes.number,

    avatar: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,

    organization: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = state => {
  return {
    ranks: state.ranks.ranks,
  }
}

export default connect(mapStateToProps, null)(UserCard);
