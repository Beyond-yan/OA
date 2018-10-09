package com.gdssoft.oa.dao.system.impl;

import java.sql.SQLException;
import java.util.List;

import org.hibernate.HibernateException;
import org.hibernate.Query;
import org.hibernate.Session;
import org.springframework.orm.hibernate3.HibernateCallback;

import com.gdssoft.oa.dao.system.DictionaryDao;
import com.gdssoft.oa.model.system.Dictionary;
import com.gdssoft.core.dao.impl.BaseDaoImpl;

public class DictionaryDaoImpl extends BaseDaoImpl<Dictionary> implements DictionaryDao{

	public DictionaryDaoImpl() {
		super(Dictionary.class);
	}

	@Override
	public List<String> getAllItems() {
		final String hql = "select itemName from Dictionary group by itemName";
		return (List<String>)getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
				Query query = session.createQuery(hql);
				return query.list();
			}
		});
	}

	@Override
	public List<String> getAllByItemName(final String itemName) {
		final String hql = "select itemValue from Dictionary where itemName=?";
		return (List<String>)getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
				Query query = session.createQuery(hql);
				query.setString(0,itemName);
				return query.list();
			}
		});
	}
	
	public List<Dictionary> getByItemName(final String itemName){
		final String hql = " from Dictionary where itemName=?";
		return (List<Dictionary>)getHibernateTemplate().execute(new HibernateCallback() {
			@Override
			public Object doInHibernate(Session session) throws HibernateException,
					SQLException {
				Query query = session.createQuery(hql);
				query.setString(0,itemName);
				return query.list();
			}
		});
	}

}