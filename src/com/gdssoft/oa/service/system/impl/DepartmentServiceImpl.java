package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.List;

import com.gdssoft.oa.dao.system.DepartmentDao;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.UserDepartment;
import com.gdssoft.oa.service.system.DepartmentService;
import com.gdssoft.core.service.impl.BaseServiceImpl;
import com.gdssoft.core.web.paging.PagingBean;

public class DepartmentServiceImpl extends BaseServiceImpl<Department> implements
		DepartmentService {

	private DepartmentDao dao;
	public DepartmentServiceImpl(DepartmentDao dao) {
		super(dao);
		this.dao=dao;
	}
	public List<UserDepartment> findUserDepartmentTree(String depIds,String roles,String subDeptId){
		List<UserDepartment> list=dao.findUserDepartmentTree(depIds, roles, subDeptId);
		return list;
	}
	@Override
	public List<Department> findByParentId(Long parentId) {
		return dao.findByParentId(parentId);
	}
	@Override
	public List<Department> finddeparmentparent(Long parentId) {
		return dao.finddeparmentparent(parentId); 
	}
	public List<Department> findByParentId(Long parentId,String depId) {
		return dao.findByParentId(parentId,depId);
	}
	public List<Department> findByParentIdAndDepIds(Long parentId,String depIds){
		return dao.findByParentIdAndDepIds(parentId, depIds);
	}
	@Override
	public List<Department> findByDepName(String depName) {
		return dao.findByDepName(depName);
	}
	@Override
	public List<Department> findByPath(String path) {
		return dao.findByPath(path);
	}
	
	/**
	 * 获取第3级 即部门id
	 * @param dept
	 * @return
	 */
	public Department get3LevelDept(Department dept){
		Integer depLevel = dept.getDepLevel();
		Department result = null;
		if(depLevel != null && depLevel > 3){
			result = getDeptByLevel(dept,3);
		} else {
			result = dept;
		}
		//System.out.println("result:"+result.getDepName());
		return result;
	}
	/**
	 * 获取非本部门第3级 即部门id
	 * @param dept
	 * @return
	 */
	public Department get3LevelDept2(Department dept){
		Integer depLevel = dept.getDepLevel();
		Department result = null;
		if(depLevel != null && depLevel > 3){
			result = getDeptByLevel(dept,3);
		} else {
			if(dept.getIsExternal()==0){
				result = getDeptByLevel(dept,2);
			}else{
				result = dept;
			}
		}
		//System.out.println("result:"+result.getDepName());
		return result;
	}
	/**
	 * 根据leve获取特定部门的部门id
	 * @param dept
	 * @param Level
	 * @return
	 */
	public Department getDeptByLevel(Department dept,int Level){
		String path = dept.getPath();
		String path2 = path.substring(0, path.length()-1);
		String[] s = path2.split("\\.");
		//System.out.println("path2"+path2);
		return dao.get(Long.valueOf(s[Level-1]));
	}

	@Override
	public List<Department> findAllLevel3(){
		return dao.findAllLevel3();
	}
	/**
	 * 获得公文分发部门列表
	 */
	public List<Department> findSentArchDeps(Long parentId,String depIds,PagingBean pb){
		return dao.findSentArchDeps(parentId, depIds, pb);
	}
	public List<Department> findByDeparmentForCache(){
		return dao.findByDeparmentForCache();
	}
	@Override
	public List<Department> findByAdmin(Long parentId, Boolean isAdmin) {
		return dao.findByAdmin(parentId, isAdmin);
	}
	
	@Override
	public List<Department> findNotAll(Boolean isAdmin) {
		return dao.findNotAll(isAdmin);
	}
	@Override
	public List<Department> findChildrenByConfig(Long depId) {
		return dao.findChildrenByConfig(depId);
	}
	public List<Department> findDepartmentBySchema(String schemaCode){
		return dao.findDepartmentBySchema(schemaCode);
	}
}
