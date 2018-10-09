package com.gdssoft.oa.dao.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.sql.SQLException;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.oa.dao.hrm.EmpProfileDao;
import com.gdssoft.oa.model.hrm.EmpProfile;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class EmpProfileDaoImpl extends BaseDaoImpl<EmpProfile> implements EmpProfileDao{

	public EmpProfileDaoImpl() {
		super(EmpProfile.class);
	}

	@Override
	public boolean checkProfileNo(final String profileNo) {
		final String hql = "select count(*) from EmpProfile ep where ep.profileNo = ?";
		Long count = (Long)getHibernateTemplate().execute(new HibernateCallback(){
			@Override
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query query = session.createQuery(hql);
				query.setString(0, profileNo);
				return query.uniqueResult();
			}});
		if(count!=0){
			return false;
		}else{
			return true;
		}
	}

}