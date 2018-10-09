package com.gdssoft.oa.dao.common;

import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class BaseDao {

	@Autowired
	@Resource(name = "sqlMapClientTemplate")
	protected MySqlMapClientTemplate sqlMapClientTemplate;
	
	public MySqlMapClientTemplate getSqlMapClientTemplate() {
		return sqlMapClientTemplate;
	}
	public void setSqlMapClientTemplate(MySqlMapClientTemplate sqlMapClientTemplate) {
		this.sqlMapClientTemplate = sqlMapClientTemplate;
	}
	protected transient final Log logger = LogFactory.getLog(getClass());
	
	//获取列表
	@SuppressWarnings("unchecked")
	public <T> List<T> queryList(String statementName, Map<String, Object> map){
		return (List<T>) sqlMapClientTemplate .queryForList(statementName+".queryList", map);
	}
	//获取总条数
	public int queryCount(String statementName, Map<String, Object> map){
		return  (int) sqlMapClientTemplate .queryForObject(statementName+".queryCount", map);
	}
	//获取分页列表
	@SuppressWarnings("unchecked")
	public <T> List<T> queryPageList(String statementName, Map<String, Object> map){
		return (List<T>) sqlMapClientTemplate .queryForList(statementName+".queryPageList", map);
	}
	//根据ID获取实体
	@SuppressWarnings("unchecked")
	public <T> T query(String statementName, String id){
		return  (T) sqlMapClientTemplate .queryForObject(statementName+".query", id);
	}
	//添加
	public <T> boolean insert(String statementName,T t){
		//返回的是主键？
		boolean result = false;
		try {
			sqlMapClientTemplate .insert(statementName+".insert", t);
			result = true;
		} catch (Exception e) {
			// TODO: handle exception
			e.printStackTrace();
		}

		return  result;
	}
	//修改
	public <T> boolean edit(String statementName, T t){
		int result = this.sqlMapClientTemplate.update(statementName+".edit", t);
		System.out.println("--edit-->"+result);
		return  result > 0;
	}
	//是否置顶
	public <T> boolean top(String statementName,T t){
		int result = this.sqlMapClientTemplate.update(statementName+".top", t);
		System.out.println("--top-->"+result);
		return  result > 0;
	}
	//逻辑删除
	public boolean del(String statementName, String id){
		int result = this.sqlMapClientTemplate.update(statementName+".del", id);
		System.out.println("--del-->"+result);
		return  result > 0;
	}
	//物理删除
	public boolean remove(String statementName, String id){
		int result = this.sqlMapClientTemplate.delete(statementName+".remove", id);
		System.out.println("--remove-->"+result);
		return  result > 0;
	}
	
	/**
	 * 获取列表，statementName 不加后缀
	 * @param statementName
	 * @param map
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public <T> List<T> queryListSatement(String statementName, Map<String, Object> map){
		return (List<T>) sqlMapClientTemplate .queryForList(statementName, map);
	}
	
}
