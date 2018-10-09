package com.gdssoft.oa.dao.system.impl;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.orm.hibernate3.HibernateCallback;
import org.springframework.security.userdetails.UserDetails;
import org.springframework.security.userdetails.UserDetailsService;
import org.springframework.security.userdetails.UsernameNotFoundException;

import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;
import com.gdssoft.core.util.ContextUtil;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.dao.system.AppUserDao;
import com.gdssoft.oa.dao.system.DepartmentDao;
import com.gdssoft.oa.dao.system.SysUserAllDao;
import com.gdssoft.oa.model.admin.CarApply;
import com.gdssoft.oa.model.flow.JbpmTask;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Department;
import com.gdssoft.oa.model.system.SysSchemaConfig;
import com.gdssoft.oa.model.system.UserAgent;
import com.gdssoft.oa.model.system.UserDepartment;
import com.gdssoft.oa.model.system.UserSub;

public class AppUserDaoImpl extends BaseDaoImpl<AppUser> implements AppUserDao,
		UserDetailsService {
	@Resource
	private SysUserAllDao sysUserAllDao;
	@Resource
	private DepartmentDao departmentDao;
	private Log logger = LogFactory.getLog(AppUserDaoImpl.class);
	public AppUserDaoImpl() {
		super(AppUser.class);
	}
	public List<AppUser> getAppUserRoleByDepId(String depId,String roleIds){
		String schema = "";
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		if(null != ContextUtil.getCurrentUser()){
			if(!StringUtils.isBlank(ContextUtil.getCurrentUser().getOwnerSchema()))
				schema = ContextUtil.getCurrentUser().getOwnerSchema()+".";
		}
		StringBuffer sql=new StringBuffer("");
		sql.append(" SELECT AU.USERID,AU.MOBILE,AU.FULLNAME ");
		sql.append(" FROM OA.DEPARTMENT D,OA.APP_USER AU,OA.USER_ROLE UR ");
		sql.append(" WHERE D.DEPID=AU.DEPID AND AU.USERID=UR.USERID ");
		sql.append(" AND UR.ROLEID IN ("+roleIds+") ");
		sql.append(" AND D.DEPID="+depId);
		Collection<AppUser> auList =(Collection) this.jdbcTemplate.query(sql.toString(),new Object[]{},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						AppUser au=new AppUser();
						au.setUserId(rs.getLong("USERID"));
						au.setMobile(rs.getString("MOBILE"));
						au.setFullname(rs.getString("FULLNAME"));
						return au;
					}
				}
		);
		return new ArrayList(auList);
	}
	public AppUser findChiarManByParentId(String id,String name){
		String schemaCode = "";
		Long schemaId =0l;
		schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		schemaId=ContextUtil.getCurrentUser().getOwnerSchemaId();
		Long deptId=ContextUtil.getCurrentUser().getDepartment().getDepId();
		if(StringUtils.isBlank(schemaCode))
			return null;
		String sql = "SELECT {a.*},{b.*} FROM " + schemaCode + ".app_user a , " + schemaCode + ".department b "
				+" where a.depid = b.depid and (b.parentId =:id or b.parentId=:deptId )and b.depName like :name and delFlag=" 
				+ Constants.FLAG_UNDELETED
				+" order by b.path asc, a.user_level asc";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a",AppUser.class)
				.addEntity("b",Department.class)
				.setParameter("id", id)
				.setParameter("deptId", deptId)
				.setParameter("name", "%"+name+"%");
		AppUser user = null;
		List list=q.list();
		boolean isAdmin = false;
		if(list.size()>0){
			Object[] objects = (Object[])list.get(0);
			user=(AppUser)objects[0];
			user.setOwnerSchemaId(schemaId);
			user.setIsAdmin(isAdmin);
			user.setOwnerSchema(schemaCode);
		}
		return user;
	}
	public AppUser findChiarManByRoleId(String roleid){
		String schemaCode = "";
		Long schemaId =0l;
		schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
		schemaId=ContextUtil.getCurrentUser().getOwnerSchemaId();
		if(StringUtils.isBlank(schemaCode))
			return null;
		String sql = "SELECT {a.*},{b.*},{d.*} FROM " + schemaCode + ".app_user a , " + schemaCode + ".department b ,"
				+ schemaCode + ".user_role c," + schemaCode + ".app_role d"
				+" where a.depid = b.depid and a.userid = c.userid and c.roleid = d.roleid and d.roleid =:roleid and delFlag=" 
				+ Constants.FLAG_UNDELETED
				+" order by a.user_level asc";
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a",AppUser.class)
				.addEntity("b",Department.class)
				.addEntity("d",AppRole.class)
				.setParameter("roleid", roleid);
		AppUser user = null;
		List list=q.list();
		boolean isAdmin = false;
		if(list.size()>0){
			Object[] objects = (Object[])list.get(0);
			user=(AppUser)objects[0];
			Set<AppRole> set = new HashSet<AppRole>();
			for(int i = 0;i < list.size();i++){
				objects = (Object[])list.get(i);
				AppRole appRole = (AppRole) objects[2];
				if(appRole.getRoleId() == -1)
					isAdmin  =true;
				set.add(appRole);
			}
			user.setRoles(set);
			user.setOwnerSchemaId(schemaId);
			user.setIsAdmin(isAdmin);
			user.setOwnerSchema(schemaCode);
		}
		return user;
	}
	@Override
	public AppUser findByUserNameNew(String username){
		SysSchemaConfig sysSchemaConfig = null;
		String schemaCode = "";
		Long schemaId =0l;
		if(null == ContextUtil.getCurrentUser()){
			sysSchemaConfig = sysUserAllDao.findSchemaByUserName(username);
			if(null != sysSchemaConfig){
				schemaCode = sysSchemaConfig.getSchemaCode();
			    schemaId =sysSchemaConfig.getId();
			}
		}
		else{
			schemaCode = ContextUtil.getCurrentUser().getOwnerSchema();
			schemaId=ContextUtil.getCurrentUser().getOwnerSchemaId();
		}
		if(StringUtils.isBlank(schemaCode))
			return null;
		String sql = "SELECT {a.*},{b.*},{d.*} FROM " + schemaCode + ".app_user a , " + schemaCode + ".department b ,"
				+ schemaCode + ".user_role c," + schemaCode + ".app_role d"
				+" where a.depid = b.depid and a.userid = c.userid and c.roleid = d.roleid and a.username =:username and delFlag=" 
				+ Constants.FLAG_UNDELETED;
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a",AppUser.class)
				.addEntity("b",Department.class)
				.addEntity("d",AppRole.class)
				.setParameter("username", username);
		AppUser user = null;
		List list=q.list();
		boolean isAdmin = false;
		if(list.size()>0){
			Object[] objects = (Object[])list.get(0);
			user=(AppUser)objects[0];
			Set<AppRole> set = new HashSet<AppRole>();
			for(int i = 0;i < list.size();i++){
				objects = (Object[])list.get(i);
				AppRole appRole = (AppRole) objects[2];
				if(appRole.getRoleId() == -1)
					isAdmin  =true;
				set.add(appRole);
			}
			user.setRoles(set);
			user.setOwnerSchemaId(schemaId);
			user.setIsAdmin(isAdmin);
			user.setOwnerSchema(schemaCode);
		}
		return user;
	}
	
	@Override
	public AppUser findSchemaUserByUserId(String schemaCode,Long userId){
		if(StringUtils.isNotBlank(schemaCode))
			schemaCode = schemaCode + ".";
		String sql = "SELECT {a.*},{b.*} FROM " + schemaCode + "app_user a , " + schemaCode + "department b "
				+" where a.depid = b.depid  and a.userid =:userid and delFlag=" 
				+ Constants.FLAG_UNDELETED;
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a",AppUser.class)
				.addEntity("b",Department.class)
				.setParameter("userid", userId);
		AppUser user = null;
		List list=q.list();
		if(list.size()>0){
			Object[] objects = (Object[])list.get(0);
			user=(AppUser)objects[0];
			Department department = (Department)objects[1];
			user.setDepartment(department);
			user.setOwnerSchema(schemaCode);
		}
		return user;
	}
	@Override
	public List<AppUser> findSchemaUser(String schemaCode){
		String sql = "SELECT {a.*},{b.*} FROM " + schemaCode + ".app_user a , " + schemaCode + ".department b "
				+" where a.depid = b.depid  and b.depUnitCode like :schemaCode and delFlag=" 
				+ Constants.FLAG_UNDELETED;
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a",AppUser.class)
				.addEntity("b",Department.class)
				.setParameter("schemaCode", schemaCode+"%");
		AppUser user = null;
		List<AppUser> userList=new ArrayList<AppUser>();
		List list=q.list();
		if(list.size()>0){
			for(int i=0;i<list.size();i++){
				Object[] objects = (Object[])list.get(i);
				user=(AppUser)objects[0];
				userList.add(user);
			}
		}
		return userList;
	}
	@Override
	public AppUser findByUserName(String username) {
		String hql = "from AppUser au where au.username =?";
		Object[] params = { username.toLowerCase() };
		List<AppUser> list = findByHql(hql, params);
		AppUser user = null;
		if (list.size() != 0) {
			user = list.get(0);
		}
		return user;
	}

	public static void main(String[] args) {
		List<AppUser> list = new AppUserDaoImpl()
				.findByHql("select * from AppUser");
	}

	@Override
	public UserDetails loadUserByUsername(final String username)
			throws UsernameNotFoundException, DataAccessException {
		AppUser user = (AppUser) getHibernateTemplate().execute(
				new HibernateCallback() {
					public Object doInHibernate(Session session)
							throws HibernateException, SQLException {
						AppUser user = findByUserNameNew(username);				
						try {
							if (user != null) {
								Long depId=user.getDepartment().getDepId();
								//departmentDao.findByDeparmentIdAndSchema(user.getOwnerSchema()+ ".",user.getd);
								// 进行合并权限的处理
								Set<AppRole> roleSet = user.getRoles();
								Iterator<AppRole> it = roleSet.iterator();

								while (it.hasNext()) {
									AppRole role = it.next();
									if (role.getRoleId().equals(
											AppRole.SUPER_ROLEID)) {// 具有超级权限
										user.getRights().clear();
										user.getRights().add(
												AppRole.SUPER_RIGHTS);
										break;
									} else {
										if (StringUtils.isNotEmpty(role
												.getRights())) {
											String[] items = role.getRights()
													.split("[,]");
											for (int i = 0; i < items.length; i++) {
												if (!user.getRights().contains(
														items[i])) {
													user.getRights().add(
															items[i]);
												}
											}
										}
									}
								}

							}
						} catch (Exception ex) {
							logger.warn("user:" + username
									+ " can't not loding rights:"
									+ ex.getMessage());
						}
						return user;
					}
				});

		return user;
	}
	
	

	/**
	 * 根据部门PATH及员工姓名工号属性查找
	 */
	@Override
	public List findByDepartment(String path, PagingBean pb,String name,String code) {
		List list = new ArrayList();
		String hql = new String();
		if(name!=null){
			name="%"+name + "%";
		}else{
			name="%%";
		}
		if(code!=null){
			code="%"+code + "%";
		}else{
			code="%%";
		}
		if ("0.".equals(path)) {
			hql = "from AppUser vo2 where vo2.delFlag = ? and vo2.fullname like ? and vo2.username like ? order by vo2.userlevel asc";
			list.add(Constants.FLAG_UNDELETED);
			list.add(name);
			list.add(code);
		} else if("0.1.16.".equals(path)){
			hql = "select vo1 from AppUser vo1 join vo1.department vo2 where vo2.path like ? and vo1.delFlag = ? and vo1.fullname like ? and vo1.username like ? order by vo1.userlevel asc";
			list.add(path + "%");
			list.add(Constants.FLAG_UNDELETED);
			list.add(name);
			list.add(code);
		}else{
			hql = "select vo1 from  AppUser vo1 join vo1.department vo2  where vo2.path like ? and vo1.delFlag = ? and vo1.fullname like ? and vo1.username like ? order by vo1.userlevel asc";
			list.add(path + "%");
			list.add(Constants.FLAG_UNDELETED);
			list.add(name);
			list.add(code);
		}
		return findByHql(hql, list.toArray(), pb);
	}
	/**
	 * 根据部门PATH属性查找
	 */
	@Override
	public List findByDepartment(String path, PagingBean pb) {
		String hql = "select vo2 from AppUser vo2 join vo2.department vo1 where  vo2.delFlag = ? and vo1.path like ? order by vo2.userlevel asc";
		List list = new ArrayList();
		list.add(Constants.FLAG_UNDELETED);
		list.add(path + "%");
		return findByHql(hql, list.toArray());
	}
	/**
	 * 在部门中模糊查找人员
	 */
	@Override
	public List findIndep(String fullName,String path, PagingBean pb) {
		List list = new ArrayList();
		String hql = new String();
		if ("0.".equals(path)) {
			hql = "from AppUser vo2 where vo2.delFlag = ? and vo2.fullname like ? order by vo2.userlevel asc";
			list.add(Constants.FLAG_UNDELETED);
			list.add("%"+fullName+ "%");
		} else {
			hql = "select vo2 from AppUser vo2 join vo2.department vo1 where  vo1.path like ? and vo2.delFlag = ? and vo2.fullname like ?  order by vo2.userlevel asc";
			list.add(path + "%");
			list.add(Constants.FLAG_UNDELETED);
			list.add("%"+fullName+ "%");
		}
		return findByHql(hql, list.toArray(), pb);
	}

	
	@Override
	public List findByDepartment(Department department) {
		String hql = "select vo2 from AppUser vo2 join vo2.department vo1 where  vo1.path like ? and vo2.delFlag = ?  order by vo2.userlevel asc";
		Object[] params = { department.getPath() + "%",
				Constants.FLAG_UNDELETED };
		return findByHql(hql, params);
	}

	@Override
	public List findByRole(Long roleId) {
		String hql = "select vo from AppUser vo join vo.roles roles where roles.roleId=? and vo.delFlag = ?  order by vo.userlevel asc";
		Object[] objs = { roleId, Constants.FLAG_UNDELETED };
		return findByHql(hql, objs);
	}

	@Override
	public List findByRole(Long roleId, PagingBean pb) {
		String hql = "select vo from AppUser vo join vo.roles roles where roles.roleId=? and vo.delFlag = ? order by vo.userlevel asc";
		Object[] objs = { roleId, Constants.FLAG_UNDELETED };
		return findByHql(hql, objs, pb);
	}
	
	@Override
	public List findByRoleInDep(Long roleId, String path,PagingBean pb) {
		String hql = "select vo from AppUser vo join vo.department vo1 join vo.roles roles where roles.roleId=?  and vo.delFlag = ? and vo1.path like ? order by vo.userlevel asc";
		Object[] objs = { roleId, Constants.FLAG_UNDELETED,path+"%" };
		return findByHql(hql, objs, pb);
	}

	@Override
	public List<AppUser> findByDepartment(String path) {
		String hql = "select vo2 from AppUser vo2 join vo2.department vo1 where  vo1.path like ? and vo2.delFlag =? order by vo2.userlevel asc";
		Object[] params = { path + "%", Constants.FLAG_UNDELETED };
		return findByHql(hql, params);
	}

	public List findByRoleId(Long roleId) {
		String hql = "select vo from AppUser vo join vo.roles as roles where roles.roleId=? and vo.delFlag =?  order by vo.userlevel asc";
		return findByHql(hql, new Object[] { roleId, Constants.FLAG_UNDELETED });
	}

	public List findByUserIds(Long... userIds) {
		String hql = "select vo from AppUser vo where vo.delFlag=? ";

		if (userIds == null || userIds.length == 0)
			return null;
		hql += " where vo.userId in (";
		int i = 0;
		for (Long userId : userIds) {
			if (i++ > 0) {
				hql += ",";
				
			}
			hql += "?";
		}
		hql += " )";

		return findByHql(hql,
				new Object[] { Constants.FLAG_UNDELETED, userIds });
	}

	@Override
	public List<AppUser> findSubAppUser(String path, Set<Long> userIds,
			PagingBean pb) {
		String st = "";
		if (userIds.size() > 0) {
			Iterator<Long> it = userIds.iterator();
			StringBuffer sb = new StringBuffer();
			while (it.hasNext()) {
				sb.append(it.next().toString() + ",");
			}
			sb.deleteCharAt(sb.length() - 1);
			st = sb.toString();
		}

		List list = new ArrayList();
		StringBuffer hql = new StringBuffer();
		if (path != null) {
			hql
					.append("select vo2 from Department vo1,AppUser vo2 where vo1=vo2.department ");
			hql.append(" and vo1.path like ?");
			list.add(path + "%");
		} else {
			hql.append("from AppUser vo2 where 1=1 ");
		}
		if (st != "") {
			hql.append(" and vo2.userId not in (" + st + ")");
		}
		hql.append(" and vo2.delFlag = ?");
		list.add(Constants.FLAG_UNDELETED);
		return findByHql(hql.toString(), list.toArray(), pb);
	}

	@Override
	public List<AppUser> findSubAppUserByRole(Long roleId, Set<Long> userIds,
			PagingBean pb) {
		String st = "";
		if (userIds.size() > 0) {
			Iterator<Long> it = userIds.iterator();
			StringBuffer sb = new StringBuffer();
			while (it.hasNext()) {
				sb.append(it.next().toString() + ",");
			}
			sb.deleteCharAt(sb.length() - 1);
			st = sb.toString();
		}
		StringBuffer hql = new StringBuffer(
				"select vo from AppUser vo join vo.roles roles where roles.roleId=? order by vo.userlevel asc");
		List list = new ArrayList();
		list.add(roleId);
		if (st != "") {
			hql.append(" and vo.userId not in (" + st + ")");
		}
		hql.append(" and vo.delFlag =?");
		list.add(Constants.FLAG_UNDELETED);
		return findByHql(hql.toString(), list.toArray(), pb);
	}

	@Override
	public List<AppUser> findByDepId(Long depId) {
		String hql = "from AppUser vo where vo.delFlag=0 and vo.department.depId=? order by vo.userlevel asc";
		Object[] objs = { depId };
		return findByHql(hql, objs);
	}
	public List<AppUser> findUserDepartmentTree(String depIds,String roles){
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
			sql+=" AND D.DEPID = "+depIds;
		}
		if(roles!=null&&!"".equals(roles)){
			sql+=" AND UR.ROLEID IN ("+roles+")";
		}
		sql+=" ORDER BY D.DEPARTMENT_LEVEL ASC,AU.USER_LEVEL ASC";
		Collection<AppUser> user =(Collection) this.jdbcTemplate.query(sql,
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						AppUser au=new AppUser();
						au.setUserId(rs.getLong("USERID"));
						au.setFullname(rs.getString("USERNAME"));
						return au;
					}
				}
		);
		return new ArrayList(user);
	}

	public List<AppUser> findByDepIdForCommon(Long depId) {
		String hql = "select  *  from "+ Constants.PUBLIC_SCHEMA_OA3+".app_user vo where vo.delFlag=0 and vo.depId=:depId  order by vo.user_level asc";
		Object[] objs = { depId };
		Query query = this.getSession().createSQLQuery(hql).addEntity(AppUser.class).setParameter("depId", depId);
		List<AppUser> list = query.list();
		return list;
	}

	/**
	 * 取得没有被某个用户代理的所有账号
	 * 
	 * @param userId
	 * @param fullname
	 * @param pb
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<AppUser> getUnAgents(final Long userId, String fullname,
			PagingBean pb) {
		final String hql = "from UserAgent ua where ua.userId=?";
		List<UserAgent> userAgents = (List<UserAgent>) getHibernateTemplate()
				.executeFind(new HibernateCallback() {
					@Override
					public Object doInHibernate(Session session)
							throws HibernateException, SQLException {
						Query query = session.createQuery(hql);
						query.setLong(0, userId);
						return query.list();
					}
				});
		String hql2 = "from AppUser au where au.status=? ";
		ArrayList params = new ArrayList();
		params.add(Constants.ENABLED);

		if (StringUtils.isNotEmpty(fullname)) {
			hql2 += " and au.fullname like ?";
			params.add("%" + fullname + "%");
		}

		StringBuffer sb = new StringBuffer(userId.toString());
		for (UserAgent userAgent : userAgents) {
			sb.append(",").append(userAgent.getGrantUId());
		}
		hql2 += " and au.userId not in(" + sb.toString() + ")";

		return findByHql(hql2, params.toArray(), pb);
	}

	/**
	 * 取得没有被管理员选中当下属的用户
	 * 
	 * @param userId
	 * @param fullname
	 * @param pb
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public List<AppUser> getUnSubUser(final Long userId, String fullname,
			PagingBean pb) {
		final String hql = "from UserSub ua where ua.userId=?";
		List<UserSub> userSubs = (List<UserSub>) getHibernateTemplate()
				.executeFind(new HibernateCallback() {
					@Override
					public Object doInHibernate(Session session)
							throws HibernateException, SQLException {
						Query query = session.createQuery(hql);
						query.setLong(0, userId);
						return query.list();
					}
				});
		String hql2 = "from AppUser au where au.status=? ";
		ArrayList params = new ArrayList();
		params.add(Constants.ENABLED);

		if (StringUtils.isNotEmpty(fullname)) {
			hql2 += " and au.fullname like ?";
			params.add("%" + fullname + "%");
		}

		StringBuffer sb = new StringBuffer(userId.toString());
		for (UserSub userSub : userSubs) {
			sb.append(",").append(userSub.getUserId());
		}
		hql2 += " and au.userId not in(" + sb.toString() + ")";

		return findByHql(hql2, params.toArray(), pb);
	}

	@Override
	public List<AppUser> findUserByDepandRole(Long roleId, Long depId) {
		// TODO Auto-generated method stub
		String hql = "select vo from AppUser vo join vo.roles roles where roles.roleId=? and vo.department.depId=? and vo.delFlag=0 order by vo.userlevel asc";
		Object[] objs = { roleId, depId };
		return findByHql(hql, objs);
	}
	
	public List<AppUser> findUserByDepandRole(Long roleId, Long depId,PagingBean pb) {
		// TODO Auto-generated method stub
		String hql = "select vo from AppUser vo join vo.roles roles where roles.roleId=?  and vo.department.depId=? and vo.delFlag=0 order by vo.userlevel asc";
		Object[] objs = { roleId, depId};
		return findByHql(hql, objs,pb);
	}

	@Override
	public void gupdate(String uID, String phone, String mobile, String email,String position) 
	{
		phone = phone == null ? "" : phone;
		email = email == null ? "" : email;
		mobile = mobile == null ? "" : mobile;
		position = position == null ? "" : position;
		
		StringBuffer sb = new StringBuffer("UPDATE app_user  SET ");
		sb.append(" email = '{email}' , ".replace("{email}", email));
		sb.append(" phone = '{phone}' ,".replace("{phone}", phone));
		sb.append(" mobile = '{mobile}' , ".replace("{mobile}", mobile));
		sb.append(" position = '{position}' ".replace("{position}", position));
		sb.append(" where userid = " + uID);
		try {
			jdbcTemplate.execute(sb.toString());
		} catch (DataAccessException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public List<AppUser> getDeptsUser(Long depId,String userfullname,PagingBean pb) {
		String hql = "from AppUser vo where vo.delFlag=0 and vo.department.depId=? and vo.fullname like '%'+?+'%'";
		Object[] objs = { depId,userfullname };
		return findByHql(hql, objs,pb);
	}
	/**
	 * 
	 * 当前角色下的用户
	 * 
	 * @param roleId
	 * @return
	 */
	public List<AppUser> searchUser(Long roleId) {
		// TODO Auto-generated method stub
		String sql = "select vo from AppUser vo join vo.roles roles where roles.roleId=?";
		Object[] obc = { roleId };
		return findByHql(sql, obc);
	}
	
	
	/**
	 * 部门某个角色下所有用户
	 */
	public List<AppUser> getUserByDepAndRole(Long roleId,Long depId){
		String sql="select vo from AppUser vo join vo.department dep  where dep.depId in(select depId  from department where depId=? "+
						"union select depId from department where parentId=? "+
									"union select depId from department where parentId in (select depId from department where parentId =?)) " +
									"join vo.roles roles where roles.roleId=?";
		Object[] obc ={depId,depId,depId,roleId};
		System.out.println(findByHql(sql, obc).size());
		return findByHql(sql, obc);
	}
	
	
	// 查询当前用户是否是管理员
	@Override
	public int searchUsr_Role(Long userId) {
		// TODO Auto-generated method stub
		String sql = "select count(1) from user_role ur where ur.userid=" + userId + " and ur.roleid=-1" ;
		int num = this.jdbcTemplate.queryForInt(sql);
		return num;
	}

	/**
	 * 根据部门PATH属性和 roleId查找用户列表
	 */
	@Override
	public List selectByDepAndRole(String path, PagingBean pb,Long roleId) {
		List list = new ArrayList();
		String hql = new String();
		if ("0.".equals(path)) {			
			hql = "from AppUser vo2 join vo2.roles roles where roles.roleId=? and vo2.delFlag = ?";
			list.add(roleId);
			list.add(Constants.FLAG_UNDELETED);
		} else {
			hql = "select vo2 from Department vo1 join AppUser vo2 where vo1=vo2.department and vo1.path like ? and vo2.delFlag = ?";
			list.add(path + "%");
			list.add(Constants.FLAG_UNDELETED);
		}
		List<AppUser> userListTemp = findByHql(hql, list.toArray(), pb);		
		return filterUserByRole(userListTemp,roleId);
	}
	/**
	 * 查询具有指定角色的用户列表
	 * @param list
	 * @param roleId
	 * @return
	 */
	public List<AppUser> filterUserByRole(List<AppUser> list,Long roleId){
		System.out.println("---roleId:--"+roleId);
		List<AppUser> result = new ArrayList<AppUser>();
		AppRole appRole = new AppRole();
		appRole.setRoleId(roleId);
		for(AppUser appUser:list){
			Set<AppRole> roleSet = appUser.getRoles();
			if(roleSet != null){
				if(roleSet.contains(appRole)){
					result.add(appUser);
				}
			}
		}
		return result;
	}

	@Override
	public List selectByDepAndRole(String path, Long roleId) {
		List list = new ArrayList();
		String hql = new String();
		if ("0.".equals(path)) {
			hql = "from AppUser vo2 join vo2.roles roles where roles.roleId=? and vo2.delFlag = ?";
			list.add(roleId);
			list.add(Constants.FLAG_UNDELETED);
		} else {
			hql = "select vo2 from AppUser vo2 join vo2.department vo1 where  vo1.path like ? and vo2.delFlag = ?";
			
			list.add(path + "%");
			list.add(Constants.FLAG_UNDELETED);
		}
		List<AppUser> userListTemp = findByHql(hql, list.toArray());	
		return filterUserByRole(userListTemp,roleId);
	}

	public List<AppUser> getAppUserByDepIds(String depIds, PagingBean pb){
		
		List list = new ArrayList();
		String hql = "select vo from AppUser vo where vo.department.depId in("+depIds+")";
		return findByHql(hql, null,pb);
	}
	
	public boolean testShiWu(String userId){
		// TODO Auto-generated method stub
		String sql = "update app_user set fullname = fullname+'test' where userid = " +userId;
		try {
			this.jdbcTemplate.execute(sql);
			return true;
		} catch (DataAccessException e) {
			logger.error("DataAccessException", e);
		}
		return false;
	}

	@Override
	public List findDeletedByDepartment(String path, PagingBean pb,
			short deletedStatus) {
		// TODO Auto-generated method stub
		List list = new ArrayList();
		String hql = new String();			
		hql = "select vo2 from AppUser vo2 join vo2.department vo1  where  vo1.path like ? and vo2.delFlag = ?   order by vo2.userlevel asc";
		list.add(path + "%");
		list.add(deletedStatus);	
		return findByHql(hql, list.toArray());
	}
	
	@SuppressWarnings("unchecked")
	public List<AppUser> findByDepAndUsername(String deptCode, String userName, String deptName){
		String connection = "";
		ArrayList<AppUser> users = new ArrayList<AppUser>();
		if (StringUtils.isNotBlank(deptCode)) {
			connection += " and d.depUnitCode=:deptCode";
		}
		if (StringUtils.isNotBlank(userName)) {
			connection += " and a.fullname like '%" + userName + "%'";
		}
		if (StringUtils.isNotBlank(deptName)) {
			connection += " and d.depName = '" + deptName + "'";
		}
		String hql = "select  {a.*},{d.*}  from " + Constants.PUBLIC_SCHEMA_OA3
				+ ".app_user a, " + Constants.PUBLIC_SCHEMA_OA3
				+ ".department d   where  a.depId=d.depId and  a.status = 1"
				+ connection;
		Query query = this.getSession().createSQLQuery(hql)
				.addEntity("a", AppUser.class).addEntity("d",Department.class);
		if(StringUtils.isNotBlank(deptCode)){
			query.setParameter("deptCode", deptCode);
		}
		List list = query.list();
		for(int i =0; i<list.size(); i++){
			Object[] objects = (Object[])list.get(i);
			AppUser user=(AppUser)objects[0];
			Department department = (Department)objects[1];
		
			user.setDepartment(department);
			users.add(user);
		}
		// return query.list();
		return users;
	}
	
	@Override
	public AppUser findByNameAndSchema(String schema, String username) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "select a.* from " + schema + "app_user a where a.username = :username";
		Query query = this.getSession().createSQLQuery(sql).addEntity("a", AppUser.class)
				.setParameter("username", username);
		List<AppUser> list = query.list();
		if(list.size()>0){
			return list.get(0);
		}else{
			return null;
		}
	}
	
	@Override
	public List<Long> findRolesByUser(String schema, Long userId) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		List<Long> list = new ArrayList<Long>();
		String sql = "select roleId from " + schema + "user_role ur where ur.userId = :userId";
		Query query = this.getSession().createSQLQuery(sql).setParameter("userId", userId);
		List listSearch = query.list();
		for(int i = 0; i < listSearch.size(); i++){
			list.add(new Long(listSearch.get(i).toString()));
		}
		return list;
	}
	
	@Override
	public AppUser findByIdAndSchema(String schema, Long userId) {
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		String sql = "select au.* from " + schema + "app_user au where au.userId = :userId";
		Query query = this.getSession().createSQLQuery(sql).addEntity("au", AppUser.class)
				.setParameter("userId", userId);
		List<AppUser> list = query.list();
		if(list.size() > 0){
			return list.get(0);
		}else{
			return null;
		}
	}
	
	@Override
	public Long findDepIdByNameAndSchema(String schema, String username) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "select a.DEPID from " + schema + "app_user a where a.username = :username";
		Query query = this.getSession().createSQLQuery(sql).setParameter("username", username);
		List list = query.list();
		if(list!=null){
			BigDecimal depId=(BigDecimal)list.get(0);
			return depId.longValue();
		}else{
			return null;
		}
	}
	@Override
	public List<AppUser> findUserByRole(String roleId,String name) {
		// TODO Auto-generated method stub
		String hql = "select vo from AppUser vo join vo.roles roles join vo.department department where roles.roleId in ("+roleId +") and vo.delFlag=0 and vo.fullname like ? order by department.departmentLevel, vo.userlevel asc";
		Object[] objs = {"%" + name + "%" };
		return findByHql(hql, objs);
	}
	
	@Override
	public List<AppUser> findByDepPathAndSchema(String schema, String depPath,Long roleId) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "SELECT au.* FROM "+schema+"app_user au WHERE au.depid IN (SELECT d.depid FROM "+schema+"department d WHERE d.PATH LIKE '"+depPath+"%') AND au.userid IN (SELECT ur.userid "
                       +" FROM "+schema+"user_role ur WHERE ur.roleid = :roleId)";
		Query query = this.getSession().createSQLQuery(sql).addEntity("au", AppUser.class).setParameter("roleId", roleId);
		List<AppUser> list = query.list();
		return list;
	}
	@Override
	public List<AppUser> findByDepPathAndSchemaAndRoleIds(String schema, String depPath,Long roleId1,Long roleId2) {
		if(StringUtils.isNotBlank(schema)) schema = schema + ".";
		String sql = "SELECT au.* FROM "+schema+"app_user au WHERE au.depid IN (SELECT d.depid FROM "+schema+"department d WHERE d.PATH LIKE '"+depPath+"%') AND au.userid IN (SELECT ur.userid "
                       +" FROM "+schema+"user_role ur WHERE ur.roleid = :roleId1  AND ur.userid IN (SELECT ur.userid FROM "+schema+"user_role ur WHERE ur.roleid = :roleId2))";
		Query query = this.getSession().createSQLQuery(sql).addEntity("au", AppUser.class).setParameter("roleId1", roleId1).setParameter("roleId2", roleId2);
		List<AppUser> list = query.list();
		return list;
	}
	@Override
	public AppUser findByUsername(String schemaCode, String username) {
		if(StringUtils.isNotBlank(schemaCode)) schemaCode = schemaCode + ".";
		String sql = "SELECT {a.*},{b.*},{d.*} FROM " + schemaCode + "app_user a , " + schemaCode + "department b ,"
				+ schemaCode + "user_role c," + schemaCode + "app_role d"
				+" where a.depid = b.depid and a.userid = c.userid and c.roleid = d.roleid and a.username =:username and delFlag=" 
				+ Constants.FLAG_UNDELETED;
		Query q = getSession().createSQLQuery(sql)
				.addEntity("a",AppUser.class)
				.addEntity("b",Department.class)
				.addEntity("d",AppRole.class)
				.setParameter("username", username);
		AppUser user = null;
		List list=q.list();
		boolean isAdmin = false;
		if(list.size()>0){
			Object[] objects = (Object[])list.get(0);
			user=(AppUser)objects[0];
			Set<AppRole> set = new HashSet<AppRole>();
			for(int i = 0;i < list.size();i++){
				objects = (Object[])list.get(i);
				AppRole appRole = (AppRole) objects[2];
				if(appRole.getRoleId() == -1)
					isAdmin  =true;
				set.add(appRole);
			}
			user.setRoles(set);
			user.setIsAdmin(isAdmin);
		}
		return user;
	}
	
	public List<AppUser> findUserDirectorById(String schema, Long userId) {
		if(StringUtils.isNotBlank(schema)) schema = schema+".";
		String sql = "select dau.* from " + schema + "app_user dau "
				+ " join " + schema + "app_user au on au.depid = dau.depid "
				+ " join " + schema + "user_role ur on ur.userId = dau.userId "
				+ " where ur.roleId in (100152,100156) "
				+ " and au.userId = :userId ";
		Query query = this.getSession().createSQLQuery(sql).addEntity("dau", AppUser.class)
				.setParameter("userId", userId);
		List<AppUser> list = query.list();
		return list;
	}
	@Override
	public List<Map<String, String>> getChannelId(String schema,Long userId) {
		String sql ="SELECT DEVICETYPE,CHANNELID FROM "+schema+".APP_BAIDU_PUSH_DEVICE WHERE USERID="+userId;
		Collection<Map<String, String>> auList =(Collection) this.jdbcTemplate.query(sql.toString(),new Object[]{},
				new RowMapper() {
					@Override
					public Object mapRow(ResultSet rs, int rowNum) throws SQLException {
						Map<String, String> au=new HashMap<String, String>();
						au.put("DEVICETYPE", rs.getString("DEVICETYPE"));
						au.put("CHANNELID", rs.getString("CHANNELID"));
						return au;
					}
				}
		);
		return new ArrayList(auList);
	}
}
