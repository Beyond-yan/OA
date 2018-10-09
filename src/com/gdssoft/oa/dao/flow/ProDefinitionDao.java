package com.gdssoft.oa.dao.flow;

/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
 */
import java.util.List;
import java.util.Map;

import com.gdssoft.core.dao.BaseDao;
import com.gdssoft.core.web.paging.PagingBean;
import com.gdssoft.oa.model.flow.ProDefinition;

/**
 * 
 * @author
 * 
 */
public interface ProDefinitionDao extends BaseDao<ProDefinition> {
	/**
	 * 按发布ID取得XML
	 * 
	 * @param deployId
	 * @return
	 */
	public ProDefinition getByDeployId(String deployId);

	/**
	 * get by name
	 * 
	 * @param name
	 * @return
	 */
	public ProDefinition getByName(String name);
	
	public Map<Long,String> getProDefinitionMap(Long typeId);

	/**
	 * 
	 * 根据流程分类Id获取指定的流程
	 * 
	 * @param typeId
	 * @return
	 */
	public List<ProDefinition> getProDefinitions(Long typeId);

	/**
	 * 
	 * 根据类型名称获取流程
	 * 
	 * @param typename
	 * @param typeNametep
	 * @return
	 */
	public List<ProDefinition> getProDefinitions(String typename,
			String typeNametep,PagingBean pb);
	
	public List getProDefinitionList(Long typeId);

}