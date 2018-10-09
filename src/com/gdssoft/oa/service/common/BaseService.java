package com.gdssoft.oa.service.common;

import java.util.List;
import java.util.Map;

public interface BaseService {
	
	 <T> List<T> queryList(Map<String, Object> map);//获取列表
	 int queryCount(Map<String, Object> map);//获取总条数
	 <T> List<T> queryPageList(Map<String, Object> map);//获取分页列表
	 <T> T query(String id);//根据ID获取实体
	 <T> boolean insert(T t);//添加
	 <T> boolean edit(T t);//修改
	 <T> boolean top(T t);//置顶
	 boolean del(String id);//逻辑删除
	 boolean remove(String id);//物理删除
}
