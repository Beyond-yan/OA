// Decompiled by Jad v1.5.8e2. Copyright 2001 Pavel Kouznetsov.
// Jad home page: http://kpdus.tripod.com/jad.html
// Decompiler options: packimports(3) fieldsfirst ansi space 
// Source File Name:   AppUtil.java

package com.gdssoft.core.util;

import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import javax.servlet.ServletContext;

import org.apache.commons.lang.StringUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.dom4j.Attribute;
import org.dom4j.Document;
import org.dom4j.Element;
import org.dom4j.Node;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.security.context.SecurityContext;

import com.gdssoft.core.DataInit.DataInit;
import com.gdssoft.core.jbpm.jpdl.ProcessInit;
import com.gdssoft.core.model.OnlineUser;
import com.gdssoft.core.web.filter.SecurityInterceptorFilter;
import com.gdssoft.oa.model.system.AppFunction;
import com.gdssoft.oa.model.system.AppRole;
import com.gdssoft.oa.model.system.AppUser;
import com.gdssoft.oa.model.system.Company;
import com.gdssoft.oa.model.system.FunUrl;
import com.gdssoft.oa.model.system.SysConfig;
import com.gdssoft.oa.service.system.AppFunctionService;
import com.gdssoft.oa.service.system.CompanyService;
import com.gdssoft.oa.service.system.FunUrlService;
import com.gdssoft.oa.service.system.SysConfigService;

// Referenced classes of package com.gdssoft.core.util:
//			XmlUtil, PropertiesUtil

public class AppUtil
	implements ApplicationContextAware
{

	private static Log logger = LogFactory.getLog("com/gdssoft/core/util/AppUtil");
	private static Map configMap = new HashMap();
	private static ServletContext servletContext = null;
	private static Map onlineUsers = new LinkedHashMap();
	private static ApplicationContext appContext;
	private static Document lefMenuDocument = null;
	private static Document publicDocument = null;
	private static Set publicMenuIds = null;
	
	public static String interfaceSchema = "";

	public AppUtil()
	{
	}

	public void setApplicationContext(ApplicationContext applicationContext)
		throws BeansException
	{
		appContext = applicationContext;
	}

	public static Document getLeftMenuDocument()
	{
		return lefMenuDocument;
	}

	public static void setLeftMenuDocument(Document doc)
	{
		lefMenuDocument = doc;
	}

	public static Document getPublicDocument()
	{
		return publicDocument;
	}

	public static void setPublicDocument(Document pubDoc)
	{
		publicDocument = pubDoc;
	}

	public static void setPublicMenuIds(Set pubIds)
	{
		publicMenuIds = pubIds;
	}

	public static Object getBean(String beanId)
	{
		return appContext.getBean(beanId);
	}

	public static Map getOnlineUsers()
	{
		return onlineUsers;
	}

	public static void removeOnlineUser(String sessionId)
	{
		onlineUsers.remove(sessionId);
	}

	public static void addOnlineUser(String sessionId, AppUser user)
	{
		if (!onlineUsers.containsKey(sessionId))
		{
			OnlineUser onlineUser = new OnlineUser();
			onlineUser.setFullname(user.getFullname());
			onlineUser.setSessionId(sessionId);
			onlineUser.setUsername(user.getUsername());
			onlineUser.setUserId(user.getUserId());
			if (!user.getUserId().equals(AppUser.SUPER_USER))
				onlineUser.setDepPath((new StringBuilder(".")).append(user.getDepartment().getPath()).toString());
			Set roles = user.getRoles();
			StringBuffer roleIds = new StringBuffer(",");
			AppRole role;
			try {
			for (Iterator iterator = roles.iterator(); iterator.hasNext(); roleIds.append((new StringBuilder()).append(role.getRoleId()).append(",").toString()))
				role = (AppRole)iterator.next();
			} catch (Exception e) {
				e.printStackTrace();
				logger.error(AppUtil.class.getName(), e);
			}
			onlineUser.setRoleIds(roleIds.toString());
			onlineUser.setTitle(user.getTitle());
			onlineUsers.put(sessionId, onlineUser);
		}
	}

	public static String getAppAbsolutePath()
	{
		return servletContext.getRealPath("/");
	}

	public static String getFlowFormAbsolutePath()
	{
		String path = (String)configMap.get("app.flowFormPath");
		if (path == null)
			path = "/WEB-INF/FlowForm/";
		return (new StringBuilder(String.valueOf(getAppAbsolutePath()))).append(path).toString();
	}

	public static String getMobileFlowFlowAbsPath()
	{
		return (new StringBuilder(String.valueOf(getAppAbsolutePath()))).append("/mobile/flow/FlowForm/").toString();
	}

	public static void reloadSecurityDataSource()
	{
		SecurityInterceptorFilter securityInterceptorFilter = (SecurityInterceptorFilter)getBean("securityInterceptorFilter");
		securityInterceptorFilter.loadDataSource();
	}

	public static void init(ServletContext in_servletContext)
	{
		servletContext = in_servletContext;
		String filePath = servletContext.getRealPath("/WEB-INF/classes/conf/");
		String configFilePath = (new StringBuilder(String.valueOf(filePath))).append("/config.properties").toString();
		Properties props = new Properties();
		try
		{
			FileInputStream fis = new FileInputStream(configFilePath);
			Reader r = new InputStreamReader(fis, "UTF-8");
			props.load(r);
			String key;
			for (Iterator it = props.keySet().iterator(); it.hasNext(); configMap.put(key, props.get(key)))
				key = (String)it.next();

		}
		catch (Exception ex)
		{
			logger.error(ex.getMessage());
		}
		
		String xslStyle = (new StringBuilder(String.valueOf(servletContext.getRealPath("/js/menu")))).append("/menu-left.xsl").toString();
		Document doc = getOrignalMenuDocument();
		try
		{
			Document finalDoc = XmlUtil.styleDocument(doc, xslStyle);
			setLeftMenuDocument(finalDoc);
		}
		catch (Exception ex)
		{
			logger.error((new StringBuilder("menux.xml trasform has error:")).append(ex.getMessage()).toString());
		}
		String publicStyle = (new StringBuilder(String.valueOf(servletContext.getRealPath("/js/menu")))).append("/menu-public.xsl").toString();
		try
		{
			Document publicDoc = XmlUtil.styleDocument(doc, publicStyle);
			HashSet pubIds = new HashSet();
			Element rootEl = publicDoc.getRootElement();
			List idNodes = rootEl.selectNodes("/Menus//*");
			for (int i = 0; i < idNodes.size(); i++)
			{
				Element el = (Element)idNodes.get(i);
				Attribute attr = el.attribute("id");
				if (attr != null)
					pubIds.add(attr.getValue());
			}

			setPublicMenuIds(pubIds);
			setPublicDocument(publicDoc);
		}
		catch (Exception ex)
		{
			logger.error((new StringBuilder("menu.xml + menu-public.xsl transform has error:")).append(ex.getMessage()).toString());
		}
		if (isSetupMode())
		{
			logger.info("开始初始化系统的缺省流程...");
			ProcessInit.initFlows(getAppAbsolutePath());
			logger.info("结束初始化系统的缺省流程...");
			logger.info("初始化数据~\t开始...");
			DataInit.init(getAppAbsolutePath());
			logger.info("初始化数据~\t结束...");
			PropertiesUtil.writeKey(configFilePath, "setupMode", "false");
		}
	}

	public static Document getOrignalMenuDocument()
	{
		String menuFilePath = (new StringBuilder(String.valueOf(servletContext.getRealPath("/js/menu")))).append("/menu.xml").toString();
		Document doc = XmlUtil.load(menuFilePath);
		return doc;
	}

	public static Document getGrantMenuDocument()
	{
		String xslStyle = (new StringBuilder(String.valueOf(servletContext.getRealPath("/js/menu")))).append("/menu-grant.xsl").toString();
		Document finalDoc = null;
		try
		{
			finalDoc = XmlUtil.styleDocument(getOrignalMenuDocument(), xslStyle);
		}
		catch (Exception ex)
		{
			logger.error((new StringBuilder("menu.xml + menu-grant.xsl transform has error:")).append(ex.getMessage()).toString());
		}
		return finalDoc;
	}

	public static Document getPublicMenuDocument()
	{
		return publicDocument;
	}

	public static Set getPublicMenuIds()
	{
		return publicMenuIds;
	}

	public static void synMenu()
	{
		AppFunctionService appFunctionService = (AppFunctionService)getBean("appFunctionService");
		FunUrlService funUrlService = (FunUrlService)getBean("funUrlService");
		List funNodeList = getOrignalMenuDocument().getRootElement().selectNodes("/Menus/Items//Item/Function");
		for (int i = 0; i < funNodeList.size(); i++)
		{
			Element funNode = (Element)funNodeList.get(i);
			String key = funNode.attributeValue("id");
			String name = funNode.attributeValue("text");
			AppFunction appFunction = appFunctionService.getByKey(key);
			if (appFunction == null)
				appFunction = new AppFunction(key, name);
			else
				appFunction.setFunName(name);
			List urlNodes = funNode.selectNodes("./url");
			appFunctionService.save(appFunction);
			for (int k = 0; k < urlNodes.size(); k++)
			{
				Node urlNode = (Node)urlNodes.get(k);
				String path = urlNode.getText();
				FunUrl fu = funUrlService.getByPathFunId(path, appFunction.getFunctionId());
				if (fu == null)
				{
					fu = new FunUrl();
					fu.setUrlPath(path);
					fu.setAppFunction(appFunction);
					funUrlService.save(fu);
				}
			}

		}

	}

	public static boolean getIsSynMenu()
	{
		String synMenu = (String)configMap.get("isSynMenu");
		return "true".equals(synMenu);
	}

	public static Map getSysConfig()
	{
		if(null != ContextUtil.getCurrentUser()){
			reloadSysConfig();
			CompanyService companyService = (CompanyService)getBean("companyService");
			List cList = companyService.findCompany();
			if (cList.size() > 0)
			{
				Company company = (Company)cList.get(0);
				configMap.put("app.logoPath", company.getLogo());
				configMap.put("app.companyName", company.getCompanyName());
			}
		}
		return configMap;
	}

	public static void reloadSysConfig()
	{
		SysConfigService sysConfigService = (SysConfigService)getBean("sysConfigService");
		List list = sysConfigService.getAll();
		SysConfig conf;
		for (Iterator iterator = list.iterator(); iterator.hasNext(); configMap.put(conf.getConfigKey(), conf.getDataValue()))
			conf = (SysConfig)iterator.next();

	}

	public static String getCompanyLogo()
	{
		String defaultLogoPath = "/images/ht-logo.png";
		String path = (String)configMap.get("app.logoPath");
		if (StringUtils.isNotEmpty(path))
			defaultLogoPath = (new StringBuilder("/attachFiles/")).append(path).toString();
		return defaultLogoPath;
	}

	public static String getCompanyName()
	{
		String defaultName = "深圳市地铁三号线运营分公司";
		String companyName = (String)configMap.get("app.companyName");
		if (StringUtils.isNotEmpty(companyName))
			defaultName = companyName;
		return defaultName;
	}

	public static boolean isSetupMode()
	{
		String isSetupMode = (String)configMap.get("setupMode");
		return "true".equals(isSetupMode);
	}
	
	public static String getBrowser(String agent) {
		boolean isOpera = agent.indexOf("Opera") > -1;
		if (isOpera) {
			return "Opera";
		}; // 判断是否Opera浏览器
		if (agent.indexOf("Firefox") > -1) {
			return "FF";
		} // 判断是否Firefox浏览器
		if (agent.indexOf("Chrome") > -1) {
			return "Chrome";
		}
		if (agent.indexOf("Safari") > -1) {
			return "Safari";
		} // 判断是否Safari浏览器
		if (agent.indexOf("compatible") > -1 && agent.indexOf("MSIE") > -1
				&& !isOpera) {
			return "IE";
		}
		 // 判断是否IE浏览器
		return "";
	}
}
