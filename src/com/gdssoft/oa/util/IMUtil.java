package com.gdssoft.oa.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.velocity.app.VelocityEngine;
import org.springframework.ui.velocity.VelocityEngineUtils;
import org.tempuri.ServiceSoap;
import org.tempuri.ServiceSoapProxy;

import com.gdssoft.core.util.PropertiesFileUtil;
import com.jacob.activeX.ActiveXComponent;
import com.jacob.com.Dispatch;

/**
 * 不支持IM端口动态指定，故要求部署IM server时端口5510 5590不变，若有需求可修改该源文件编译更新
 * 
 * @author shizenghua 20131231
 */
public class IMUtil {
	private static String IM_SERVER = "";//10.224.5.179
	private static Integer IM_SERVER_PORT = 5510;
	private static String IM_SERVER_HTTP = "";
	private static String IM_RunXML_Service = "http://10.224.5.173:8080/service.asmx";
	
	static {
		IM_SERVER = PropertiesFileUtil.readValue("IM_SERVER_IP");
		
		IM_SERVER_PORT = Integer.parseInt(PropertiesFileUtil.readValue("IM_SERVER_PORT"));
		
		IM_SERVER_HTTP = "http://" + IM_SERVER + ":" + IM_SERVER_PORT;
		
		IM_RunXML_Service = PropertiesFileUtil.readValue("IM_RunXML_Service");
	}
	
	
	private static String getResponseFromUrl(String urlstr, String method)
			throws IOException {
		URL url = new URL(urlstr);
		HttpURLConnection urlConn = (HttpURLConnection) url.openConnection();
		urlConn.setDoOutput(true);
		urlConn.setDoInput(true);
		urlConn.setUseCaches(false);
		urlConn.setConnectTimeout(30000);
		urlConn.setReadTimeout(30000);
		urlConn.setRequestProperty("Content-type", "text/plain");
		urlConn.setRequestMethod(method);
		urlConn.connect();
		BufferedReader reader = new BufferedReader(new InputStreamReader(
				urlConn.getInputStream()));
		String line;
		StringBuffer sb = new StringBuffer();
		while ((line = reader.readLine()) != null) {
			sb.append(line);
		}

		reader.close();
		urlConn.disconnect();

		return sb.toString();
	}
	/**
     * 向指定 URL 发送POST方法的请求
     * 
     * @param url
     *            发送请求的 URL
     * @param param
     *            请求参数，请求参数应该是 name1=value1&name2=value2 的形式。
     * @return 所代表远程资源的响应结果
     */
    public static String sendPost(String url, String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url);
            // 打开和URL之间的连接
            URLConnection conn = realUrl.openConnection();
            // 设置通用的请求属性
            conn.setRequestProperty("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");
            // 发送POST请求必须设置如下两行
            conn.setDoOutput(true);
            conn.setDoInput(true);
            // 获取URLConnection对象对应的输出流
            out = new PrintWriter(conn.getOutputStream());
            // 发送请求参数
            out.print(param);
            // flush输出流的缓冲
            out.flush();
            // 定义BufferedReader输入流来读取URL的响应
            in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
        } catch (Exception e) {
        	//result=VersionUtil.HTTP_EXCEPTION;
            System.out.println("发送 POST 请求出现异常！"+e);
            e.printStackTrace();
        }
        //使用finally块来关闭输出流、输入流
        finally{
            try{
                if(out!=null){
                    out.close();
                }
                if(in!=null){
                    in.close();
                }
            }
            catch(IOException ex){
                ex.printStackTrace();
            }
        }
        return result;
    }
	/**
	 * 当用户名是username的IM在线返回true,否则false
	 * 
	 * @param username
	 * @return
	 */
	public static Boolean isOnline(String username) {
		String response = "";
		try {
			response = getResponseFromUrl(IM_SERVER_HTTP
					+ "/system?Name=GetUserOnlineState&LoginName="
					+ username, "GET");
		} catch (Exception e) {
			e.printStackTrace();
		}

		return "5".equals(response);
	}

	/**
	 * 获取username的IM客户端状态（int值，参见IM SDK 状态定义）
	 * 
	 * @param username
	 * @return
	 */
	public static Integer getStatus(String username) {
		Integer result = -1;
		try {
			String response = getResponseFromUrl(IM_SERVER_HTTP
					+ "/system?Name=GetUserOnlineState&LoginName="
					+ username, "GET");
			result = Integer.parseInt(response);
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;
	}

	/**
	 * 获取登录使用的临时通行证，有效期30秒
	 * 
	 * @param cun
	 * @return
	 */
	public static String getPP(String cun) {
		String response = "";
		try {
			response = getResponseFromUrl("http://"+IM_SERVER
					+ ":5590/QD/tools/GetUserPP.asp?DTime_Sec=30&LoginName="
					+ cun, "GET");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return response;
	}

	
	/**
	 * use LinkCom.Cmder component
	 * 需要将IM server bin中的LinkCom.dll添加到系统环境变量path
	 * @param xml
	 */
	private static void runXml(String xml) {
		ServiceSoapProxy s = new ServiceSoapProxy();
		s.setEndpoint(IM_RunXML_Service);
		try {
			s.runXML(xml);
		} catch (RemoteException e) {
			e.printStackTrace();
		}
	}
	
	/**
	 * use LinkCom.Cmder component
	 * 需要将IM server bin中的LinkCom.dll添加到系统环境变量path
	 * @param xml
	 */
	private static void runXml1(String xml) {
		ActiveXComponent lcmd = new ActiveXComponent("LinkCom.Cmder");
		Dispatch cmd = (Dispatch) lcmd.getObject();
		Dispatch.call(cmd, "SetServer", IM_SERVER, IM_SERVER_PORT);
		Dispatch.call(cmd, "SendCommand", xml);
	}
	
	/**
	 * 按模板弹出提示窗口
	 * @param xml
	 * @return
	 */
	public static void sendImMsg(VelocityEngine velocityEngine,Map paramsMap){
		String templatePath = "im/imNotice.vm";
		String info = (String)paramsMap.get("contentInfo");
		if(info.length()>80){
			paramsMap.put("contentInfo", info.substring(0, 80)+"...");
		}
		String xml = VelocityEngineUtils.mergeTemplateIntoString(velocityEngine,templatePath,paramsMap);
		//runXml1(xml);
		runXml(xml);
	}

	public static void sendPush(Map<String, String> model) throws UnsupportedEncodingException {
		String param="1=1";
		for(Entry<String, String> entry :model.entrySet()){
			param+="&"+entry.getKey() +"="+URLEncoder.encode(entry.getValue(), "UTF-8");
			System.out.println("key= " + entry.getKey() + " and value= " + entry.getValue());
		}
		String result=sendPost("http://117.78.46.37:8085/jwoa/push/test",param);
	}

	public static void main(String[] args) {
		Map<String, String> model = new HashMap<String, String>();
		model.put("token", "AjuHsQOMd4j9PwAW46GCQfZw41lmw4NW0G52hjT0KXQN");
		model.put("title", "OA提醒:");
		model.put("txt", "粉红色的和覅速度和覅u的话");
		model.put("type", "3");
		model.put("id", "10086");
		try {
			sendPush(model);
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}
	}
}