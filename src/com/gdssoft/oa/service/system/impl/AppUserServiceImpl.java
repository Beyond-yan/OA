package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.springframework.dao.DataAccessException;

import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.dao.system.DepartmentDao;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.service.system.AppUserService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;

public class AppUserServiceImpl extends BaseServiceImpl<AppUser> implements AppUserService{
	private AppUserDao dao;
	@Resource
	private DepartmentDao departmentDao;
	public AppUserServiceImpl(AppUserDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<AppUser> getAppUserRoleByDepId(String depId,String roleIds){
		return dao.getAppUserRoleByDepId(depId,roleIds);
	}
	public AppUser findChiarManByRoleId(String roleid){
		return dao.findChiarManByRoleId(roleid);
	}
	public AppUser findChiarManByParentId(String id,String name){
		return dao.findChiarManByParentId(id,name);
	}
	@Override
	public AppUser findByUserName(String username) {
		return dao.findByUserName(username);
	}
	@Override
	public AppUser findSchemaUserByUserId(String schemaCode,Long userId){
		return dao.findSchemaUserByUserId(schemaCode, userId);
	}
	@Override
	public AppUser findByUserNameNew(String username){
		return dao.findByUserNameNew(username);
	}

	@Override
	public List findByDepartment(String path, PagingBean pb,String name,String code) {
		return dao.findByDepartment(path,pb,name,code);
	}
	@Override
	public List findByDepartment(String path, PagingBean pb){
		return dao.findByDepartment(path,pb);
	}
	@Override
	public List findByRole(Long roleId, PagingBean pb) {
		return dao.findByRole(roleId, pb);
	}

	public List findByRoleId(Long roleId){
		return dao.findByRole(roleId);
	}

	@Override
	public List<AppUser> findSubAppUser(String path, Set<Long> userIds,
			PagingBean pb) {
		return dao.findSubAppUser(path, userIds, pb);
	}

	@Override
	public List<AppUser> findSubAppUserByRole(Long roleId, Set<Long> userIds,
			PagingBean pb) {
		return dao.findSubAppUserByRole(roleId, userIds, pb);
	}

	@Override
	public List<AppUser> findByDepId(Long depId) {
		return dao.findByDepId(depId);
	}
	public List<AppUser> findUserDepartmentTree(String depIds,String roles){
		return dao.findUserDepartmentTree(depIds,roles);
	}
	public List<AppUser> findSchemaUser(String schemaCode){
		return dao.findSchemaUser(schemaCode);
	}
	/**
	 * 取得没有被某个用户代理的所有账号
	 * @param userId
	 * @param fullname
	 * @param pb
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<AppUser> getUnAgents(final Long userId,String fullname,PagingBean pb){
		return dao.getUnAgents(userId, fullname, pb);
	}

	@Override
	public List<AppUser> getUnSubUser(Long userId, String fullname, PagingBean pb) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<AppUser> findUserByDepandRole(Long roleId,Long depId){
		// TODO Auto-generated method stub
		return dao.findUserByDepandRole(roleId, depId);
	}
	
	@Override
	 public void gupdate(String uID, String phone, String mobile, String email,String position)
	 {
		System.out.println("---------------------AppUserServiceImpl.gupdate");
		 dao.gupdate( uID, phone,mobile, email,position);
	 }

	@Override
	public List<AppUser> searchUser(Long roleId) {
		// TODO Auto-generated method stub
		return dao.searchUser(roleId);
	}
	
	@Override
	public List<AppUser> getDeptsUser(Long depId,String userfullname,PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.getDeptsUser(depId,userfullname,pb);
	}
	
	// 查询当前用户是否是管理员
	@Override
	public int searchUsr_Role(Long userId) {
		// TODO Auto-generated method stub
		return dao.searchUsr_Role(userId);
	}

	@Override
	public boolean isOfficeManager(AppUser user) {
		boolean result = false;
		//查询已有角色
		Set<AppRole> roles = user.getRoles();
		for(AppRole role:roles){
			if(role.getRoleId()==63){
				result = true;
				break;
			}
		}
		return result;
	}

	@Override
	public List<AppUser> getUserByDepAndRole(Long roleId, Long depId) {
		// TODO Auto-generated method stub
		return dao.getUserByDepAndRole(roleId, depId);
	}

	@Override
	public List selectByDepAndRole(String path, PagingBean pb, Long roleId) {
		// TODO Auto-generated method stub
		return dao.selectByDepAndRole(path, pb, roleId);
	}

	@Override
	public List selectByDepAndRole(Long depId, Long roleId) {
		System.out.println("depId"+depId);
		// 表示从上级目录开始进行查找
		String path = "0.";
		if (null != depId) {
			Department dep = departmentDao.get(depId);
			if (dep != null) {
				path = dep.getPath();
			}
		}
		System.out.println("path:"+path);
		List<AppUser> list = dao.selectByDepAndRole(path,roleId);
		return list;
	}
	
	public static void main(String[] args) {
		String s = "1,2,3,";
		System.out.println(s.substring(0,s.length()-1));
	}

	@Override
	public List<AppUser> getAppUserByDepIds(String depIds, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.getAppUserByDepIds(depIds, pb);
	}

	@Override
	public List<AppUser> findUserByDepandRole(Long roleId, Long depId, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.findUserByDepandRole(roleId, depId, pb);
	}

	@Override
	public List findIndep(String fullName, String path, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.findIndep(fullName, path, pb);
	}

	@Override
	public List findByRoleInDep(Long roleId, String path, PagingBean pb) {
		// TODO Auto-generated method stub
		return dao.findByRoleInDep(roleId, path, pb);
	}

	@Override
	public boolean testShiWu(String userId) throws SQLException{
		boolean result  = dao.testShiWu(userId);
		if(result ==false){
			 throw new SQLException("sql DataAccessException"); 
		}
		return true;
		
	}

	@Override
	public List findDeletedByDepartment(String path, PagingBean pb,
			short deletedStatus) {
		// TODO Auto-generated method stub
		return dao.findDeletedByDepartment(path, pb, deletedStatus);
	}

	@Override
	public boolean hasRoleInRoleIds(AppUser user, String roleIdsStr) {
		boolean result = false;
		String []roleIds = roleIdsStr.split("[,]");
		//查询已有角色
		Set<AppRole> roles = user.getRoles();
		for (String roleId : roleIds) {
			Long rid = Long.parseLong(roleId);
			for(AppRole role : roles){
				if(role.getRoleId() == rid){
					result = true;
					break;
				}
			}
		}
		return result;
	}
	/**
	 * 获取拟稿部门
	 */
	public String getArchivesDep(Long userId){
		AppUser appUser=dao.get(userId);
		String archDepName="";
		if(appUser.getDepartment().getDepLevel()>3){
			Department department=departmentDao.get(appUser.getDepartment().getDepId());
			String[] depPath=department.getPath().split("\\.");
			archDepName=departmentDao.get(new Long(depPath[2])).getDepName();
		}else{
			archDepName=appUser.getDepartment().getDepName();
		}
		return archDepName;
	}

	@Override
	public AppUser findByNameAndSchema(String schema, String username) {
		return dao.findByNameAndSchema(schema, username);
	}

	@Override
	public List<Long> findRolesByUser(String schema, Long userId) {
		return dao.findRolesByUser(schema, userId);
	}

	@Override
	public AppUser findByIdAndSchema(String schema, Long userId) {
		return dao.findByIdAndSchema(schema, userId);
	}
	@Override
	public List<AppUser> findUserByRole(String roleId, String name){
		return dao.findUserByRole(roleId, name);
	}
	/**
	 * 根据角色和单位查询人员
	 * add by sicen.liu
	 * 2014/12/4
	 */
	@Override
	public List<AppUser> findByDepPathAndSchema(String schema, String depPath,Long roleId) {
		return dao.findByDepPathAndSchema(schema, depPath, roleId);
	}
	/**
	 * 根据角色和单位查询人员，两个角色
	 * add by sicen.liu
	 * 2014/12/5
	 */
	public List<AppUser> findByDepPathAndSchemaAndRoleIds(String schema, String depPath,Long roleId1,Long roleId2) {
		return dao.findByDepPathAndSchemaAndRoleIds(schema, depPath, roleId1, roleId2);
	}
	@Override
	public List<Map<String, String>> getChannelId(String schema,Long userId) {
		return dao.getChannelId(schema,userId);
	}
}
