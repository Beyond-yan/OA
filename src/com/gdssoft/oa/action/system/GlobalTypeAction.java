package com.gdssoft.oa.action.system;
/*
 *  捷达世软件(深圳)有限公司 OA办公管理系统 
*/
import java.util.List;
import javax.annotation.Resource;

import org.apache.commons.lang.StringUtils;

import java.lang.reflect.Type;

import com.gdssoft.oa.model.system.GlobalType;
import com.gdssoft.oa.service.system.GlobalTypeService;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import com.gdssoft.core.command.QueryFilter;
import com.gdssoft.core.web.action.BaseAction;
import com.gdssoft.core.util.BeanUtil;


/**
 * 
 * @author 
 *
 */
public class GlobalTypeAction extends BaseAction{
	@Resource
	private GlobalTypeService globalTypeService;
	private GlobalType globalType;
	
	private Long proTypeId;
	
	private String catKey=GlobalType.CAT_ARCH_FOND;

	public String getCatKey() {
		return catKey;
	}

	public void setCatKey(String catKey) {
		this.catKey = catKey;
	}

	public Long getProTypeId() {
		return proTypeId;
	}

	public void setProTypeId(Long proTypeId) {
		this.proTypeId = proTypeId;
	}

	public GlobalType getGlobalType() {
		return globalType;
	}

	public void setGlobalType(GlobalType globalType) {
		this.globalType = globalType;
	}
	
	/**
	 * 取得其子类节点列表
	 * @return
	 */
	public String sub(){
		Long parentId=null;
		String sParentId=getRequest().getParameter("parentId");
		if(StringUtils.isNotEmpty(sParentId)){
			parentId=new Long(sParentId);
		}
		List<GlobalType> typeList=globalTypeService.getByParentIdCatKey(parentId,catKey);
		
		Type type=new TypeToken<List<GlobalType>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(typeList, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	
	public String mulSave(){
		String data =getRequest().getParameter("data");
		
		logger.info("data:" + data);
		
		if(StringUtils.isNotEmpty(data)){
			Gson gson=new Gson();
			GlobalType[]types=gson.fromJson(data, GlobalType[].class);
			
			for(int i=0;i<types.length;i++){
				GlobalType newType=globalTypeService.get(types[i].getProTypeId());
				try{
					BeanUtil.copyNotNullProperties(newType, types[i]);
					newType.setSn(i+1);
					globalTypeService.save(newType);
				}catch(Exception ex){
					logger.error(ex.getMessage());
				};
			}
		}
		
		jsonString="{success:true}";
		return SUCCESS;
	}
	
	/**
	 * 产生树
	 * @return
	 */
	public String tree(){
		StringBuffer buff = new StringBuffer("[{id:'"+0+"',text:'总分类',expanded:true,children:[");
		List<GlobalType> typeList=globalTypeService.getByParentIdCatKey(new Long(0l),catKey);
		for(GlobalType type:typeList){
			buff.append("{id:'"+type.getProTypeId()).append("',text:'"+type.getTypeName()).append("',");
		    buff.append(getChildType(type.getProTypeId(),catKey));
		}
		if (!typeList.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]}]");
		setJsonString(buff.toString());
		
		logger.info("tree json:" + buff.toString());		
		return SUCCESS;
	}
	
	/**
	 * 产品产生树
	 * @return
	 */
	public String proTree(){
		StringBuffer buff = new StringBuffer("[{id:'"+0+"',text:'总分类',expanded:true,children:[");
		List<GlobalType> typeList=globalTypeService.getByParentIdCatKey(new Long(0l),catKey);
		for(GlobalType type:typeList){
			buff.append("{id:'"+type.getProTypeId()).append("',text:'"+type.getTypeName()).append("',");
			buff.append("leaf:true,expanded:true},");
		}
		if (!typeList.isEmpty()) {
			buff.deleteCharAt(buff.length() - 1);
	    }
		buff.append("]}]");
		setJsonString(buff.toString());
		
		logger.info("tree json:" + buff.toString());		
		return SUCCESS;
	}
	public String getChildType(Long parentId,String catKey){
		StringBuffer buff=new StringBuffer();
		List<GlobalType> typeList=globalTypeService.getByParentIdCatKey(parentId,catKey);
		if(typeList.size()==0){
			buff.append("leaf:true,expanded:true},");
			return buff.toString(); 
		}else {
			buff.append("expanded:true,children:[");
			for(GlobalType type:typeList){
				buff.append("{id:'"+type.getProTypeId()).append("',text:'"+type.getTypeName()).append("',");
			    buff.append(getChildType(type.getProTypeId(),catKey));
			}
			buff.deleteCharAt(buff.length() - 1);
			buff.append("]},");
			return buff.toString();
		}
	}

	/**
	 * 显示列表
	 */
	public String list(){
		
		QueryFilter filter=new QueryFilter(getRequest());
		List<GlobalType> list= globalTypeService.getAll(filter);
		
		Type type=new TypeToken<List<GlobalType>>(){}.getType();
		StringBuffer buff = new StringBuffer("{success:true,'totalCounts':")
		.append(filter.getPagingBean().getTotalItems()).append(",result:");
		
		Gson gson=new Gson();
		buff.append(gson.toJson(list, type));
		buff.append("}");
		
		jsonString=buff.toString();
		
		return SUCCESS;
	}
	/**
	 * 批量删除
	 * @return
	 */
	public String multiDel(){
		String msg="";
		String[]ids=getRequest().getParameterValues("ids");
		//取得页面标记
		String flag=getRequest().getParameter("pageFlag");
		if(ids!=null){
			for(String id:ids){
				//删除该分类时，需要删除该分类下的所有子分类，包括其子子分类
				msg=globalTypeService.mulDel(new Long(id),flag);
			}
		}
		//jsonString="{success:true}";
		jsonString=msg;
		
		return SUCCESS;
	}
	
	/**
	 * 显示详细信息
	 * @return
	 */
	public String get(){
		GlobalType globalType=globalTypeService.get(proTypeId);
		
		Gson gson=new Gson();
		//将数据转成JSON格式
		StringBuffer sb = new StringBuffer("{success:true,data:");
		sb.append(gson.toJson(globalType));
		sb.append("}");
		setJsonString(sb.toString());
		
		return SUCCESS;
	}
	/**
	 * 添加及保存操作
	 */
	public String save(){
		if(globalType.getProTypeId()!=null){
			GlobalType orgGlobalType=globalTypeService.get(globalType.getProTypeId());
			try{
				BeanUtil.copyNotNullProperties(orgGlobalType, globalType);
				globalTypeService.save(orgGlobalType);
			}catch(Exception ex){
				logger.error(ex.getMessage());
			}
		}else{
			//缺省0代表父节点
			String parentPath="0.";
			int depth=1;
			if(globalType.getParentId()!=null && globalType.getParentId()!=0){
				GlobalType parentType=globalTypeService.get(globalType.getParentId());
				if(parentType!=null){
					parentPath=parentType.getPath();
					depth=parentType.getDepth()+1;
				}
			}
			globalType.setDepth(depth);
			
			//set sn
			
			Integer sn=globalTypeService.getCountsByParentId(globalType.getParentId());
			globalType.setSn(sn+1);
			globalTypeService.save(globalType);
			
			globalType.setPath(parentPath+ globalType.getProTypeId()+"." ) ;
			
			globalTypeService.save(globalType);
		}
		
		setJsonString("{success:true}");
		return SUCCESS;
	}
}
