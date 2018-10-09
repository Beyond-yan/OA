package com.gdssoft.oa.service.system.impl;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统  
*/
import java.util.ArrayList;
import java.util.List;
import javax.annotation.Resource;
import com.gdssoft.oa.dao.system.GlobalTypeDao;
import com.gdssoft.oa.model.system.GlobalType;
import com.gdssoft.oa.service.system.GlobalTypeService;
import com.gdssoft.core.service.impl.BaseServiceImpl;

public class GlobalTypeServiceImpl extends BaseServiceImpl<GlobalType> implements GlobalTypeService{
	
	private GlobalTypeDao dao;
	
	public GlobalTypeServiceImpl(GlobalTypeDao dao) {
		super(dao);
		this.dao=dao;
	}
	
	/*
	 * (non-Javadoc)
	 * @see com.gdssoft.oa.service.system.GlobalTypeService#getByParentIdCatKey(java.lang.Long, java.lang.String)
	 */
	public List<GlobalType> getByParentIdCatKey(Long parentId,String catKey){
		return dao.getByParentIdCatKey(parentId, catKey);
	}
	
	@Override
	public Integer getCountsByParentId(Long parentId) {
		return dao.getCountsByParentId(parentId);
	}
	
	/**
	 * 删除分类，同时删除其下所有子子分类
	 * 
	 * @param parentId
	 *            update by F7400275 panfasen --2012.02.27
	 */
	public String mulDel(Long proTypeId, String flag) {
		GlobalType globalType = get(proTypeId);
		dao.evict(globalType);
		// 取得要删除的各层级目录列表
		List<GlobalType> subList = dao.getByPath(globalType.getPath());
		// json默认返回值
		String msg = "{success:true}";
		// 删除目录
		for (GlobalType gt : subList) {
			dao.remove(gt);
		}

		return msg;
	}

}