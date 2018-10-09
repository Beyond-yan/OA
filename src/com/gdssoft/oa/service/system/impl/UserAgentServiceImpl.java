package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.system.UserAgentDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.oa.service.system.UserAgentService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class UserAgentServiceImpl extends BaseServiceImpl<UserAgent> implements UserAgentService{
	private UserAgentDao dao;
	
	public UserAgentServiceImpl(UserAgentDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/**
	 * 取得某个用户的代理用户列表
	 * @param userId
	 * @return
	 */
	public List<UserAgent> getByUserId(Long userId){
		return dao.getByUserId(userId);
	}
	
	public void delUserGrants(Long userId){
		List<UserAgent> list=getByUserId(userId);
		for(UserAgent userAgent:list){
			dao.remove(userAgent);
		}
	}
	
	public UserAgent getByUserIdGrantId(Long userId,Long grantUId){
		return dao.getByUserIdGrantId(userId, grantUId);
	}

	@Override
	public List<UserAgent> getByGrantUId(Long grantUId) {
		// TODO Auto-generated method stub
		return dao.getByGrantUId(grantUId);
	}

	@Override
	public List<UserAgent> getMySelfUserAgent(AppUser appUser) {
		// TODO Auto-generated method stub
		return dao.getMySelfUserAgent(appUser);
	}

	@Override
	public List<UserAgent> getByGrantUIdAndSchema(String schema, Long grantUId) {
		return dao.getByGrantUIdAndSchema(schema, grantUId);
	}

}