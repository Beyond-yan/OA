package com.gdssoft.oa.dao.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.apache.commons.lang.StringUtils;
import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.jdbc.core.RowMapper;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.system.DepartmentDao;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.UserDepartment;

public class DepartmentDaoImpl extends BaseDaoImpl<Department> implements DepartmentDao {

	public DepartmentDaoImpl() {
		super(Department.class);
	}
	public List<UserDepartment> findUserDepartmentTree(String depIds,String roles,String subDeptId){
		AppUser appUser=ContextUtil.getCurrentUser();
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != appUser){
			if(!StringUtils.isBlank(appUser.getOwnerSchema()))
				schema = appUser.getOwnerSchema()+".";
		}
		String sql = " SELECT DISTINCT AU.USERID USERID,AU.FULLNAME USERNAME,D.DEPID DEPTID,D.DEPNAME DEPTNAME,AU.USER_LEVEL,D.PATH,D.DEPARTMENT_LEVEL "
					+" FROM "+schema+"APP_USER AU " 
					+" LEFT JOIN "+schema+"DEPARTMENT D ON AU.DEPID=D.DEPID "
					+" LEFT JOIN "+schema+"USER_ROLE UR ON UR.USERID=AU.USERID ";
		sql+=" WHERE AU.STATUS=1 AND AU.DELFLAG=0 ";
		if(depIds!=null&&!"".equals(depIds)){
			sql+=" AND D.PATH LIKE '%."+depIds+".%'";
		}
		if(roles!=null&&!"".equals(roles)){
			sql+=" AND UR.ROLEID IN ("+roles+")";
		}
		if(subDeptId!=null&&!"".equals(subDeptId)){
			sql+=" AND D.DEPID NOT IN ("+subDeptId+")";
		}
		sql+=" ORDER BY D.DEPARTMENT_LEVEL ASC,AU.USER_LEVEL ASC";
		Collection<UserDepartment> dept =(Collection) this.jdbcTemplate.query(sql,
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						UserDepartment ud=new UserDepartment();
						ud.setUserId(rs.getLong("USERID"));
						ud.setUserName(rs.getString("USERNAME"));
						ud.setDeptId(rs.getLong("DEPTID"));
						ud.setDeptName(rs.getString("DEPTNAME"));
						return ud;
					}
				}
		);
		return new ArrayList(dept);
	}
	@Override
	public List<Department> findByParentId(Long parentId) {
		final String hql = "from Department d where d.parentId=? AND d.isExternal!=3 order by d.departmentLevel asc";
		Object[] params ={parentId};
		return findByHql(hql, params);
	}
	@Override
	public List<Department> finddeparmentparent(Long parentId) {
		final String hql = "from Department d where d.depId=? AND d.isExternal!=3";
		Object[] params ={parentId};
		return findByHql(hql, params);
	}
	public List<Department> findByParentId(Long parentId,String depId) {
		//ArrayList alist = new ArrayList(); 
		String hql = "from Department d where d.isExternal!=3  AND d.parentId="+parentId ;
		
		//alist.add(parentId);
		
		if(depId!=null && !"".equals(depId) )
		{ 
  			hql+=" and d.depId in ("+depId+")";
			//alist.add(depId);
		}
		//Object[] params =alist.toArray(); 
		return findByHql(hql);
		
 	}

	@Override
	public List<Department> findByVo(Department department, PagingBean pb) {
		ArrayList paramList=new ArrayList();
		String hql="from Department vo where vo.isExternal!=3";
		if(StringUtils.isNotEmpty(department.getDepName())){
			hql+=" and vo.depName like ?";
			paramList.add("%"+department.getDepName()+"%");
		}
		if(StringUtils.isNotEmpty(department.getDepDesc())){
			hql+=" and vo.depDesc=?";
			paramList.add("%"+department.getDepDesc()+"%");
		}
		return findByHql(hql, paramList.toArray(), pb);
	}

	@Override
	public List<Department> findByDepName(String depName) {
		String hql="from Department vo where vo.isExternal!=3 and vo.depName=?";		
		String[] param={depName};
		return findByHql(hql,param);
	}

	@Override
	public List<Department> findByPath(String path) {
		String hql="from Department vo where vo.isExternal!=3 and vo.path like ?";
		String[] param={path+"%"};
		return findByHql(hql,param);
	}
	
	@Override
	public List<Department> findAllLevel3(){
		String hql="from Department vo where vo.isExternal!=3 and vo.depLevel = ?";
		Object[] params={3};
		return findByHql(hql,params);
	}
	public List<Department> findSentArchDeps(Long parentId,String depIds,PagingBean pb){
		String hql="from Department vo where vo.isExternal!=3 and vo.depLevel = ?";
		if(parentId!=null && !"".equals(parentId)){
			hql+=" and vo.parentId="+parentId;
		}
		if(StringUtils.isNotEmpty(depIds)){
			hql+=" and vo.depId not in ("+depIds+")";
		}
		Object[] params={3};
		return findByHql(hql, params, pb);
	}
	public List<Department> findByParentIdAndDepIds(Long parentId,String depIds) { 
		String hql = "from Department d where  d.parentId="+parentId ;
		if(depIds!=null && !"".equals(depIds) )
		{ 
  			hql+=" and d.depId not in ("+depIds+")";
		}
		hql += "and d.isExternal!=3 order by d.departmentLevel asc";
		return findByHql(hql);
		
 	}
	
	public List<Department> findByDeparmentForCache(){                                                                                                                       
		String hql = "from Department d where d.isExternal!=3 order by d.departmentLevel asc";
		return findByHql(hql);
	}
	
	public List<Department> findByCodeAndName(String depCode, String name){
		String conn = "";
		ArrayList params = new ArrayList();
		if(StringUtils.isNotBlank(depCode)){
			conn += " and d.depUnitCode='"+depCode+"'";
			params.add(depCode);
		}
		if(StringUtils.isNotBlank(name)){
			conn += " and d.depName='"+name+"'";
		}
		String hql = "select  *  from " + Constants.PUBLIC_SCHEMA_OA3 +".department  d  where d.isExternal!=3 " + conn;
		Query query = this.getSession().createSQLQuery(hql).addEntity(Department.class);
		return query.list();
	}
	
	public List<Department> findAllParents(List<Long> list){
		StringBuffer conn = new StringBuffer();
		for(int i =0 ; i < list.size(); i++){
			conn.append(list.get(i)).append(",");
		}
		conn.deleteCharAt(conn.length()-1);
		String hql = "select distinct  *  from " + Constants.PUBLIC_SCHEMA_OA3+".Department START WITH depid in("+conn +") CONNECT BY PRIOR  parentid=depid order by deplevel";
		Query q = this.getSession().createSQLQuery(hql).addEntity(Department.class);
		return q.list();
	}
	
	@Override
	public List<Department> findByParentIdByCommon(Long parentId) {
		final String hql = "select * from " + Constants.PUBLIC_SCHEMA_OA3 + ".Department d where d.isExternal!=3 and d.parentId=:parentId order by d.department_Level asc";
		Object[] objs = { parentId };
		Query query = this.getSession().createSQLQuery(hql).addEntity(Department.class).setParameter("parentId", parentId);
		List<Department> list = query.list();
		return list;
	}

	@Override
	public List<Department> findByAdmin(Long parentId, Boolean isAdmin) {
		String sql = "select d.DEPID,d.DEPNAME,d.DEPLEVEL from department d where d.PARENTID= :parentId";
		if(!isAdmin){
			sql += " and d.is_External=0";
		}
		sql += "and d.is_External!=3 order by d.department_Level asc";
		Query query = this.getSession().createSQLQuery(sql).setParameter("parentId", parentId);
		List<Department> depList = new ArrayList<Department>();
		List list = query.list();
		for(int i = 0; i < list.size(); i++){
			Object[] objs = (Object[])list.get(i);
			Department department = new Department();
			department.setDepId(new Long(objs[0].toString()));
			department.setDepName(objs[1].toString());
			department.setDepLevel(new Integer(objs[2].toString()));
			depList.add(department);
		}
		return depList;
	}

	@Override
	public List<Department> findNotAll(Boolean isAdmin) {
		String sql = "select d.DEPID,d.DEPNAME,d.DEPLEVEL,d.PARENTID from department d where 1=1";
		if(!isAdmin) sql +=" and d.is_External=0";
		sql += "and d.is_External!=3 order by d.department_Level asc";
		Query query = this.getSession().createSQLQuery(sql);
		List<Department> depList = new ArrayList<Department>();
		List list = query.list();
		for(int i = 0; i < list.size(); i++){
			Object[] objs = (Object[])list.get(i);
			Department department = new Department();
			department.setDepId(new Long(objs[0].toString()));
			department.setDepName(objs[1].toString());
			department.setDepLevel(new Integer(objs[2].toString()));
			department.setParentId(new Long(objs[3].toString()));
			depList.add(department);
		}
		return depList;
	}

	@Override
	public List<Department> findChildrenByConfig(Long depId) {
		String sql = "select d.depId,d.depName,d.parentId from department d where d.is_External=0 start with d.depId = :depId connect by prior d.depId = d.parentId order by D.department_level";
		Query query = this.getSession().createSQLQuery(sql).setParameter("depId", depId);
		List<Department> depList = new ArrayList<Department>();
		List list = query.list();
		for(int i = 0; i < list.size(); i++){
			Object[] objs = (Object[])list.get(i);
			Department department = new Department();
			department.setDepId(new Long(objs[0].toString()));
			department.setDepName(objs[1].toString());
			department.setParentId(new Long(objs[2].toString()));
			depList.add(department);
		}
		return depList;
	}
	@Override
	public List<Department> findParentCode(Long parentId) {
		final String hql = "select * from " + Constants.PUBLIC_SCHEMA_OA3 + ".Department d where d.depId=:parentId";
		Object[] objs = { parentId };
		Query query = this.getSession().createSQLQuery(hql).addEntity(Department.class).setParameter("parentId", parentId);
		List<Department> list = query.list();
		return list;
	}
	public List<Department> findDepartmentBySchema(String schemaCode) {
		final String hql = "select * from " + schemaCode + ".Department d where d.depUnitCode like :schemaCode order by d.path asc";
		Query query = this.getSession().createSQLQuery(hql).addEntity(Department.class).setParameter("schemaCode", schemaCode+"%");
		List<Department> list = query.list();
		return list;
	}
}
