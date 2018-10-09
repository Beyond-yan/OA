package com.gdssoft.oa.service.common.impl;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import com.gdssoft.oa.dao.common.BaseDao;
import com.gdssoft.oa.service.common.BaseService;

public class BaseServiceImpl implements BaseService {

	@Resource(name = "ibatisBaseDao")
	protected BaseDao baseDao;
	
	public BaseDao getBaseDao() {
		return baseDao;
	}

	public void setBaseDao(BaseDao baseDao) {
		this.baseDao = baseDao;
	}

	private String statementName;
	public BaseServiceImpl(String statementName){
		this.statementName = statementName;
	}
	
	@Override
	public <T> List<T> queryList(Map<String, Object> map) {
		return baseDao.queryList(statementName, map);
	}

	@Override
	public int queryCount(Map<String, Object> map) {
		return baseDao.queryCount(statementName,map);
	}

	@Override
	public <T> List<T> queryPageList(Map<String, Object> map) {
		return baseDao.queryPageList(statementName,map);
	}

	@Override
	public <T> T query(String id) {
		return baseDao.query(statementName,id);
	}

	@Override
	public <T> boolean insert(T t) {
		return baseDao.insert(statementName,t);
	}

	@Override
	public <T> boolean edit(T t) {
		return baseDao.edit(statementName,t);
	}

	@Override
	public <T> boolean top(T t) {
		return baseDao.top(statementName,t);
	}

	@Override
	public boolean del(String id) {
		return baseDao.del(statementName,id);
	}

	@Override
	public boolean remove(String id) {
		return baseDao.remove(statementName, id);
	}

}
