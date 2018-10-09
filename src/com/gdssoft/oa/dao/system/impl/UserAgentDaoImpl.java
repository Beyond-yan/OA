package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Query;

import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.oa.dao.system.UserAgentDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.UserAgent;

public class UserAgentDaoImpl extends BaseDaoImpl<UserAgent> implements UserAgentDao{

	public UserAgentDaoImpl() {
		super(UserAgent.class);
	}
	/**
	 * 取得某个用户的代理用户列表
	 * @param userId
	 * @return
	 */
	public List<UserAgent> getByUserId(Long userId){
		String hql="from UserAgent ua where ua.userId=?";
		return findByHql(hql, new Object[]{userId});
	}
	
	/**
	 * 
	 * @param userId
	 * @param grantUId
	 * @return
	 */
	public UserAgent getByUserIdGrantId(Long userId,Long grantUId){
		String hql="from UserAgent ua where ua where ua.userId=? and ua.grantUId=?";
		return(UserAgent)findUnique(hql, new Object[]{userId,grantUId});
	}
	@Override
	public List<UserAgent> getByGrantUId(Long grantUId) {
		// TODO Auto-generated method stub
		String hql="from UserAgent ua where ua.grantUId=?";
		return findByHql(hql, new Object[]{grantUId});
	}
	@Override
	public List<UserAgent> getMySelfUserAgent(AppUser appUser) {
		String hql="from UserAgent ua where ua.userId=? and ua.userId !=ua.grantUId";
		return findByHql(hql, new Object[]{appUser.getUserId()});
	}
	@Override
	public List<UserAgent> getByGrantUIdAndSchema(String schema, Long grantUId) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "select ua.* from " + schema + "USER_AGENT ua where ua.GRANTUID = :grantUId";
		Query query = this.getSession().createSQLQuery(sql).addEntity("ua" , UserAgent.class)
				.setParameter("grantUId", grantUId);
		return query.list();
	}

}