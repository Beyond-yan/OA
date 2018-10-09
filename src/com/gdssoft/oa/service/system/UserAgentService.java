package com.gdssoft.oa.service.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.core.service.BaseService;

public interface UserAgentService extends BaseService<UserAgent>{
	/**
	 * 取得某个用户的代理用户列表
	 * @param userId
	 * @return
	 */
	public List<UserAgent> getByUserId(Long userId);
	
	public UserAgent getByUserIdGrantId(Long userId,Long grantUId);
	
	public List<UserAgent> getByGrantUId(Long grantUId);
	
	public void delUserGrants(Long userId);
	
	/**
	 * 返回自己设置的待办列表
	 * @return
	 */
	public List<UserAgent> getMySelfUserAgent(AppUser appUser);
	
	public List<UserAgent> getByGrantUIdAndSchema(String schema, Long grantUId);
}


