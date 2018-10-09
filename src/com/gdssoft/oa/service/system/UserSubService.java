package com.gdssoft.oa.service.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;
import java.util.Set;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.UserSub;
import com.gdssoft.core.service.BaseService;

public interface UserSubService extends BaseService<UserSub>{
	/**
	 *  查找所有上属IDs
	 */
	public Set<Long> findAllUpUser(Long userId);
	
	/**
	 * 查找已经是下属的ID列表
	 */
	public List<Long> subUsers(Long userId);
	
	/**
	 * 查找上一级的ID
	 */
	public List<Long> upUser(Long userId);
	
	//查找所有下属的ID
	public List<UserSub> findByUser(Long userId);

    public void delSubUser(Long userId);
	
	
}


