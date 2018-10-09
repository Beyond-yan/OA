package com.gdssoft.oa.dao.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;

import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.UserDepartment;
import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;

public interface DepartmentDao extends BaseDao<Department> {
	public List<UserDepartment> findUserDepartmentTree(String depIds,String roles,String subDeptId);
	public List<Department> findByParentId(Long parentId);
	public List<Department> finddeparmentparent(Long parentId);
	public List<Department> findByParentId(Long parentId,String depId);
	public List<Department> findByParentIdAndDepIds(Long parentId,String depIds);
	public List<Department> findByVo(Department department,PagingBean pb);
	public List<Department> findByDepName(String depName);
	public List<Department> findByPath(String path);
	/**
	 * 获得所有第三级部门的list
	 * @return 部门list
	 * @author Super S.Gao 
	 * @date 2012/02/17
	 */
	public List<Department> findAllLevel3();
	/**
	 * 获得公文分发部门列表
	 * @author liusicen
	 */
	public List<Department> findSentArchDeps(Long parentId,String depIds,PagingBean pb);
	
	public List<Department> findByCodeAndName(String depCode, String name);
	
	public List<Department> findAllParents(List<Long> list);
	
	public List<Department> findByParentIdByCommon(Long parentId);
	public List<Department> findByDeparmentForCache();
	
	/**
	 * 根据是否是管理员选择显示当前人所在Schema部门还是所有部门
	 */
/*	public List<Department> findByAdmin(Boolean isOA, Boolean isAdmin);*/
	
	public List<Department> findNotAll(Boolean isAdmin);
	List<Department> findByAdmin(Long parentId, Boolean isAdmin);
	List<Department> findChildrenByConfig(Long depId);
	public List<Department> findParentCode(Long parentId);
	public List<Department> findDepartmentBySchema(String schemaCode);
}
