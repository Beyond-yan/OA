package com.gdssoft.oa.dao.system;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;

public interface AppUserDao extends BaseDao<AppUser> {
	public List<AppUser> getAppUserRoleByDepId(String depId,String roleIds);
	public AppUser findChiarManByRoleId(String roleid);
	public AppUser findChiarManByParentId(String id,String name);
	public AppUser findByUserNameNew(String username);
	public AppUser findByUserName(String username);
	public AppUser findSchemaUserByUserId(String schemaCode,Long userId);

	public List findByDepartment(String path, PagingBean pb);
	public List findByDepartment(String path, PagingBean pb,String name,String code);

	public List findByDepartment(String path);

	public List findByDepartment(Department department);

	public List findByRole(Long roleId);

	public List findByRole(Long roleId, PagingBean pb);

	public List findByRoleId(Long roleId);

	/**
	 * 根据部门查找不是上属的用户
	 */
	public List<AppUser> findSubAppUser(String path, Set<Long> userIds,
			PagingBean pb);

	/**
	 * 根据角色查找不是上属的用户
	 */
	public List<AppUser> findSubAppUserByRole(Long roleId, Set<Long> userIds,
			PagingBean pb);

	public List<AppUser> findByDepId(Long depId);

	/**
	 * 取得没有被某个用户代理的所有账号
	 * 
	 * @param userId
	 * @param fullname
	 * @param pb
	 * @return
	 */
	public List<AppUser> getUnAgents(final Long userId, String fullname,
			PagingBean pb);

	/**
	 * 取得没有被管理员选中的用户
	 * 
	 * @param userId
	 * @param fullname
	 * @param pb
	 * @return
	 */
	public List<AppUser> getUnSubUser(final Long userId, String fullname,
			PagingBean pb);

	/**
	 * 根据部门和角色ID取得用户
	 * 
	 * @param roleId
	 * @param depId
	 * @return
	 */
	public List<AppUser> findUserByDepandRole(Long roleId, Long depId);

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
	
	public List<AppUser> getUserByDepAndRole(Long roleId,Long depId);
	
	/**
	 * 根据部门PATH属性和 roleId查找
	 */
	public List selectByDepAndRole(String path, PagingBean pb,Long roleId);
	/**
	 * 根据部门PATH属性和 roleId查找 不分页
	 */
	public List selectByDepAndRole(String path, Long roleId);
	
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
	
	public boolean testShiWu(String userId);
	
	/**
	 * @author f3225932  20121112
	 * @category 根据人员是否已删除的状态以及部门查找当前的人员信息
	 * @param path
	 * @param pb
	 * @param deletedStatus
	 * @return
	 */
	public List findDeletedByDepartment(String path, PagingBean pb,
			short deletedStatus);
	
	public List<AppUser> findByDepAndUsername(String deptCode, String userName, String deptName);
	
	public List<AppUser> findByDepIdForCommon(Long depId);
	
	public AppUser findByNameAndSchema(String schema, String username);
	
	public List<Long> findRolesByUser(String schema, Long userId);
	
	public AppUser findByIdAndSchema(String schema, Long userId);
	
	public Long findDepIdByNameAndSchema(String schema, String username);
	public List<AppUser> findUserByRole(String roleId, String name);
	/**
	 * 根据单位和schema获得人员，一个角色
	 * add by sicen.liu
	 * 2012/12/4
	 */
	public List<AppUser> findByDepPathAndSchema(String schema, String depPath,Long roleId);
	/**
	 * 根据单位和schema获得人员，两个角色
	 * add by sicen.liu
	 * 2012/12/5
	 */
	public List<AppUser> findByDepPathAndSchemaAndRoleIds(String schema, String depPath,Long roleId1,Long roleId2);
	AppUser findByUsername(String schemaCode, String username);
	
	/**
	 * 查找当前人所在单位的处长和副处长
	 * 
	 * @param schema
	 * @param userId
	 * @return
	 */
	public List<AppUser> findUserDirectorById(String schema, Long userId);
	public List<AppUser> findSchemaUser(String schemaCode);
	public List<AppUser> findUserDepartmentTree(String depIds,String roles);
	public List<Map<String, String>> getChannelId(String schema,Long userId);

}
