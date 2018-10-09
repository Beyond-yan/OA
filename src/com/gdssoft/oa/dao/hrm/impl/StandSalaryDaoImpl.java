package com.gdssoft.oa.dao.hrm.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.oa.dao.hrm.StandSalaryDao;
import com.gdssoft.oa.model.hrm.StandSalary;
import com.gdssoft.core.Constants;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class StandSalaryDaoImpl extends BaseDaoImpl<StandSalary> implements StandSalaryDao{

	public StandSalaryDaoImpl() {
		super(StandSalary.class);
	}

	@Override
	public boolean checkStandNo(final String standardNo) {
		final String hql = "select count(*) from StandSalary ss where ss.standardNo = ?";
		Long count = (Long)getHibernateTemplate().execute(new HibernateCallback(){
			@Override
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query query = session.createQuery(hql);
				query.setString(0, standardNo);
				return query.uniqueResult();
			}});
		if(count!=0){
			return false;
		}else{
			return true;
		}
	}

	@Override
	public List<StandSalary> findByPassCheck() {
	    String hql="from StandSalary vo where vo.status=?";
	    Object[] objs={Constants.FLAG_PASS};
		return findByHql(hql, objs);
	}

}