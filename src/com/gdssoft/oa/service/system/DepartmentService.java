package com.gdssoft.oa.service.system;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.UserDepartment;
import com.gdssoft.core.service.BaseService;
import com.gdssoft.core.web.paging.PagingBean;

public interface DepartmentService extends BaseService<Department> {
	public List<UserDepartment> findUserDepartmentTree(String depIds,String roles,String subDeptId);
	public List<Department> findByParentId(Long parentId);
	public List<Department>  finddeparmentparent(Long parentId);
	public List<Department> findByParentId(Long parentId,String depId);
	public List<Department> findByParentIdAndDepIds(Long parentId,String depIds);
	public List<Department> findByDepName(String depName);
	public List<Department> findByPath(String path);
	
	/**
	 * 获取第3级 即部门id
	 * @param dept
	 * @return
	 */
	public Department get3LevelDept(Department dept);
	/**
	 * 根据leve获取特定部门的部门id
	 * @param dept
	 * @param Level
	 * @return
	 */
	public Department getDeptByLevel(Department dept,int Level);
	/**
	 * 获得所有第三级部门的list
	 * @return 部门list
	 * @author Super S.Gao 
	 * @date 2012/02/17
	 */
	public List<Department> findAllLevel3();
	/**
	 * 获得公文分发部门列表
	 */
	public List<Department> findSentArchDeps(Long parentId,String depIds,PagingBean pb);
	
	public List<Department> findByDeparmentForCache();
	
/*	public List<Department> findByAdmin(Boolean isOA, Boolean isAdmin);*/
	
	public List<Department> findNotAll(Boolean isAdmin);
	List<Department> findByAdmin(Long parentId, Boolean isAdmin);
	List<Department> findChildrenByConfig(Long depId);
	public List<Department> findDepartmentBySchema(String schemaCode);
	
	public Department get3LevelDept2(Department department);
}
