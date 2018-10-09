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

import com.gdssoft.oa.dao.hrm.UserContractDao;
import com.gdssoft.oa.model.hrm.UserContract;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class UserContractDaoImpl extends BaseDaoImpl<UserContract> implements UserContractDao{

	public UserContractDaoImpl() {
		super(UserContract.class);
	}

	@Override
	public boolean checkContractNo(final String contractNo) {
		final String hql = "select count(*) from UserContract uc where uc.contractNo = ?";
		Long count = (Long)getHibernateTemplate().execute(new HibernateCallback(){
			@Override
			public Object doInHibernate(Session session)
					throws HibernateException, SQLException {
				Query query = session.createQuery(hql);
				query.setString(0, contractNo);
				return query.uniqueResult();
			}});
		if(count!=0){
			return false;
		}else{
			return true;
		}
	}

	@Override
	public List<UserContract> findTime(final Long contractId) {
		final String hql = "select uc.expireDate from UserContract uc where uc.contractId = ?";
		return findByHql(hql,new Object[]{contractId});
	}

	@Override
	public List<UserContract> findByExpireDate() {
		String hql = "from UserContract uc where uc.status=2 order by uc.expireDate desc";
		return findByHql(hql);
	}
    
}