package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.UserSub;
import com.gdssoft.core.dao.BaseDao;

/**
 * 
 * @author 
 *
 */
public interface UserSubDao extends BaseDao<UserSub>{
	
	/**
	 * 查找上属的ID
	 */
	public List<Long> upUser(Long userId);
	
	/**
	 * 查找已经是下属的ID列表
	 */
	public List<Long> subUsers(Long userId);
	
	/**
	 * 查找属于用户下的下属列表
	 */
	public List<UserSub> findByUser(Long userId);
}