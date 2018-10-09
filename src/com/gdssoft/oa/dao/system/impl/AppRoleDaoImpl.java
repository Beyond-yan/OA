package com.gdssoft.oa.dao.system.impl;
/*
 * 捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.oa.dao.system.AppRoleDao;
import com.gdssoft.oa.model.system.AppFunction;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.FunUrl;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class AppRoleDaoImpl extends BaseDaoImpl<AppRole> implements AppRoleDao{

	public AppRoleDaoImpl() {
		super(AppRole.class);
	}
	
	public AppRole getByRoleName(String roleName){
		String hql="from AppRole ar where ar.roleName=?";
		return (AppRole)findUnique(hql, new Object[]{roleName});
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.dao.system.AppRoleDao#getSecurityDataSource()
	 */
	public HashMap<String,Set<String>> getSecurityDataSource() {
		final HashMap<String,Set<String>> source=new HashMap<String, Set<String>>();
		
		//TODO status must be handler
		
		getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
					String hql="from AppRole";
					Query query=session.createQuery(hql);
					List<AppRole> roleList=query.list();
					
					for(AppRole role:roleList){
						TreeSet<String> urlSet=new TreeSet<String>();
						//取得某个角色的所有URL,TODO
						Iterator<AppFunction> functions=role.getFunctions().iterator();
						
						while(functions.hasNext()){
							AppFunction fun=functions.next();
							//logger.info("funName:" + fun.getFunKey());
							Iterator<FunUrl> urlIt=fun.getFunUrls().iterator();
							while(urlIt.hasNext()){
								String url=urlIt.next().getUrlPath();
								//logger.info("rolename:" + role.getName() + " url:" + url);
								urlSet.add(url);
							}
						}
						
						source.put(role.getName(), urlSet);
					}
					return null;
			}
		});
		return source;
	}
	
	@Override
	public List<AppRole> findDepRole(long roleId,String path) {
		String hql = "select vo from AppRole vo join vo.appUsers vo1 join vo1.roles as roles where vo1.department.path like ? and vo1.delFlag =? and vo.roleId=?";
		Object[] params = { "0.1.3.", Constants.FLAG_UNDELETED,24};
		return findByHql(hql, params);
	}

}
