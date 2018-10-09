package com.gdssoft.oa.service.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;


public interface AppUserService extends BaseService<AppUser>{
	public List<AppUser> getAppUserRoleByDepId(String depId,String roleIds);
	public AppUser findChiarManByRoleId(String roleid);
	public AppUser findChiarManByParentId(String id,String name);
	public AppUser findByUserName(String username);
	public AppUser findByUserNameNew(String username);
	public AppUser findSchemaUserByUserId(String schemaCode,Long userId);
	public List findByDepartment(String path,PagingBean pb,String name,String code);
	
	/**
	 * @author f3225932  20121112
	 * @category 根据人员是否已删除的状态以及部门查找当前的人员信息
	 * @param path
	 * @param pb
	 * @param deletedStatus
	 * @return
	 */
	public List findDeletedByDepartment(String path,PagingBean pb,short deletedStatus);
	
	public List findByRole(Long roleId,PagingBean pb);
	public List findByRoleId(Long roleId);
	/**
	 * 根据部门查找不是上属的用户
	 */
	public List<AppUser> findSubAppUser(String path,Set<Long> userIds,PagingBean pb);
	/**
	 * 根据角色查找不是上属的用户
	 */
	public List<AppUser> findSubAppUserByRole(Long roleId,Set<Long> userIds,PagingBean pb);

	public List findByDepartment(String path, PagingBean pb);
	public List<AppUser> findByDepId(Long depId);
	public List<AppUser> findUserDepartmentTree(String depIds,String roles);
	public List<AppUser> findSchemaUser(String schemaCode);
	/**
	 * 取得没有被某个用户代理的所有账号
	 * @param userId
	 * @param fullname
	 * @param pb
	 * @return
	 */
	public List<AppUser> getUnAgents(final Long userId,String fullname,PagingBean pb);
	
	public List<AppUser> getUnSubUser(Long userId, String fullname, PagingBean pb);
	
	/**
	 * 根据部门部门和角色ID取得用户
	 * @param roleId
	 * @param depId
	 * @return
	 */
	public List<AppUser> findUserByDepandRole(Long roleId,Long depId);
	
	public void gupdate(String uID, String phone, String mobile, String email,String position) ;
	
	public List<AppUser> getDeptsUser(Long depId,String userfullname,PagingBean pb);	
	
	/**
	 * 
	 * 查询当前角色下的用户
	 * 
	 * @param roleId
	 * @return
	 */
	public List<AppUser> searchUser(Long roleId);
		
	// 查询当前用户是否是管理员
	public int searchUsr_Role(Long userId);
	
	/**
	 * 是否是室经理 
	 * @param user
	 * @return true表示是 false表示不是
	 */
	public boolean isOfficeManager(AppUser user);
	
	public List<AppUser> getUserByDepAndRole(Long roleId,Long depId);
	
	/**
	 * 根据部门PATH属性和 roleId查找用户列表
	 */
	public List selectByDepAndRole(String path, PagingBean pb,Long roleId);
	
	public List selectByDepAndRole(Long depId,Long roleId);
	
	public List<AppUser> getAppUserByDepIds(String depIds, PagingBean pb);
	public List<AppUser> findUserByDepandRole(Long roleId, Long depId,PagingBean pb);
	
	/**
	 * 在部门中模糊查找人员
	 */
	public List findIndep(String fullName,String path, PagingBean pb);
	
	/**
	 * 
	 * 根据角色在部门中查询
	 */
	public List findByRoleInDep(Long roleId,String path, PagingBean pb);
	public boolean testShiWu(String userId)throws SQLException;
	
	/**
	 * 判断AppUser是否具有roleIds中的某一种或多种角色
	 * @param au
	 * @param roleIds
	 * @return
	 */
	public boolean hasRoleInRoleIds(AppUser au, String roleIds);
	
	/**
	 * 获取拟稿部门
	 */
	public String getArchivesDep(Long userId);
	
	public AppUser findByNameAndSchema(String schema, String username);
	
	public List<Long> findRolesByUser(String schema, Long userId);
	
	public AppUser findByIdAndSchema(String schema, Long userId);
	public List<AppUser> findUserByRole(String roleId, String name);
	/**
	 * 根据角色和单位查询人员，一个角色
	 * add by sicen.liu
	 * 2014/12/4
	 */
	public List<AppUser> findByDepPathAndSchema(String schema, String depPath,Long roleId);
	/**
	 * 根据角色和单位查询人员，两个角色
	 * add by sicen.liu
	 * 2014/12/5
	 */
	public List<AppUser> findByDepPathAndSchemaAndRoleIds(String schema, String depPath,Long roleId1,Long roleId2);
	public List<Map<String, String>> getChannelId(String schema,Long userId);
}
